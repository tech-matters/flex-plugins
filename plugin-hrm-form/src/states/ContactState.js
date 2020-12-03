import { omit } from 'lodash';

import { createBlankForm, recreateBlankForm } from './ContactFormStateFactory';
import {
  HANDLE_BLUR,
  HANDLE_VALIDATE_FORM,
  HANDLE_CHANGE,
  HANDLE_FOCUS,
  SAVE_END_MILLIS,
  HANDLE_SELECT_SEARCH_RESULT,
  CHANGE_TAB,
  RESTORE_ENTIRE_FORM,
  SET_CATEGORIES_GRID_VIEW,
  HANDLE_EXPAND_CATEGORY,
  PREPOPULATE_FORM_CHILD,
  PREPOPULATE_FORM_CALLER,
  UPDATE_CONTACTLESS_TASK,
} from './ActionTypes';
import { INITIALIZE_CONTACT_STATE, RECREATE_CONTACT_STATE, REMOVE_CONTACT_STATE } from './types';
import callTypes from './DomainConstants';
import { countSelectedCategories } from './ValidationRules';
import { copySearchResultIntoTask } from './contacts/helpers';
import { getConfig } from '../HrmFormPlugin';
import { standaloneTaskSid } from '../components/StandaloneSearch';

/**
 * Looks for a particular task in the state object, and returns it if found.
 * Returns recreated form otherwise
 * @param {{ [x: string]: any; }} tasks the current tasks object (retrieved from state)
 * @param {string} taskId the task we are looking for
 * @returns if the task exists in state, returns its current form.
 *  Otherwise returns a recreated blank form
 */
const findOrRecreate = (tasks, taskId) => {
  const targetedTask = tasks[taskId];

  if (targetedTask === undefined) {
    const recreatedTask = recreateBlankForm();
    return recreatedTask;
  }

  return targetedTask;
};

const initialState = {
  tasks: {
    [standaloneTaskSid]: createBlankForm(),
  },
};

export class Actions {
  static handleChange = (taskId, parents, name, value) => ({ type: HANDLE_CHANGE, name, taskId, value, parents });

  static handleCallTypeButtonClick = (taskId, value) => ({
    type: HANDLE_CHANGE,
    name: 'callType',
    taskId,
    value,
    parents: [],
  });

  // records the end time (in milliseconds)
  static saveEndMillis = taskId => ({ type: SAVE_END_MILLIS, taskId });

  static changeTab = (tab, taskId) => ({ type: CHANGE_TAB, tab, taskId });

  static restoreEntireForm = (form, taskId) => ({
    type: RESTORE_ENTIRE_FORM,
    form,
    taskId,
  });

  static setCategoriesGridView = (gridView, taskId) => ({ type: SET_CATEGORIES_GRID_VIEW, gridView, taskId });

  static handleExpandCategory = (category, taskId) => ({ type: HANDLE_EXPAND_CATEGORY, category, taskId });

  static prepopulateFormChild = (gender, age, taskId) => ({ type: PREPOPULATE_FORM_CHILD, gender, age, taskId });

  static prepopulateFormCaller = (gender, age, taskId) => ({ type: PREPOPULATE_FORM_CALLER, gender, age, taskId });
}

export const handleSelectSearchResult = (searchResult, taskId) => ({
  type: HANDLE_SELECT_SEARCH_RESULT,
  searchResult,
  taskId,
});

/**
 *
 * @param {{ channel: string; date: string; time: string;}} contactLessTask
 * @param {string} taskId
 */
export const updateContactLessTask = (contactLessTask, taskId) => ({
  type: UPDATE_CONTACTLESS_TASK,
  payload: contactLessTask,
  taskId,
});

export function editNestedField(original, parents, name, change) {
  if (parents.length === 0) {
    return {
      ...original,
      [name]: {
        ...original[name],
        ...change,
      },
    };
  }
  return {
    ...original,
    [parents[0]]: editNestedField(original[parents[0]], parents.slice(1), name, change),
  };
}

// eslint-disable-next-line complexity
export function reduce(state = initialState, action) {
  switch (action.type) {
    case HANDLE_BLUR: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: action.form,
        },
      };
    }

    case HANDLE_VALIDATE_FORM: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: action.form,
        },
      };
    }

    case HANDLE_FOCUS: {
      const currentForm = findOrRecreate(state.tasks, action.taskId);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: editNestedField(currentForm, action.parents, action.name, { touched: true }),
        },
      };
    }

    case HANDLE_CHANGE: {
      const { strings } = getConfig();

      const currentForm = findOrRecreate(state.tasks, action.taskId);

      const newForm = editNestedField(currentForm, action.parents, action.name, { value: action.value });

      /*
       * This is a very sad special case but it's the only case where we need to update
       * validation information on a change rather than on a blur.
       * Note that firefox and safari on Mac do not focus or blur checkboxes.
       * I'm sure there's a better way to do this.
       */
      if (action.parents.length >= 2 && action.parents[0] === 'caseInformation' && action.parents[1] === 'categories') {
        if (countSelectedCategories(newForm.caseInformation.categories) > 0) {
          newForm.caseInformation.categories.error = null;
        } else {
          newForm.caseInformation.categories.error = strings['Error-CategoryRequired'];
        }
      }

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: newForm,
        },
      };
    }

    case INITIALIZE_CONTACT_STATE: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: createBlankForm(),
        },
      };
    }

    case RECREATE_CONTACT_STATE: {
      if (state.tasks[action.taskId]) return state;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: recreateBlankForm(),
        },
      };
    }

    case SAVE_END_MILLIS: {
      const taskToEnd = findOrRecreate(state.tasks, action.taskId);

      const { metadata } = taskToEnd;
      const endedTask = { ...taskToEnd, metadata: { ...metadata, endMillis: new Date().getTime() } };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: endedTask,
        },
      };
    }

    case REMOVE_CONTACT_STATE: {
      return {
        ...state,
        tasks: omit(state.tasks, action.taskId),
      };
    }

    case HANDLE_SELECT_SEARCH_RESULT: {
      const currentTask = state.tasks[action.taskId];
      const task = copySearchResultIntoTask(currentTask, action.searchResult);

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: task,
        },
      };
    }

    case CHANGE_TAB: {
      const currentTask = state.tasks[action.taskId];
      const { metadata } = currentTask;
      const taskWithUpdatedTab = { ...currentTask, metadata: { ...metadata, tab: action.tab } };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: taskWithUpdatedTab,
        },
      };
    }

    case PREPOPULATE_FORM_CHILD: {
      const currentTask = state.tasks[action.taskId];
      const { gender, age } = action;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...currentTask,
            callType: {
              ...currentTask.callType,
              value: callTypes.child,
            },
            childInformation: {
              ...currentTask.childInformation,
              gender: {
                ...currentTask.childInformation.gender,
                value: gender,
              },
              age: {
                ...currentTask.childInformation.age,
                value: age,
              },
            },
          },
        },
      };
    }

    case PREPOPULATE_FORM_CALLER: {
      const currentTask = state.tasks[action.taskId];
      const { gender, age } = action;

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...currentTask,
            callType: {
              ...currentTask.callType,
              value: callTypes.caller,
            },
            callerInformation: {
              ...currentTask.callerInformation,
              gender: {
                ...currentTask.callerInformation.gender,
                value: gender,
              },
              age: {
                ...currentTask.callerInformation.age,
                value: age,
              },
            },
          },
        },
      };
    }

    case SET_CATEGORIES_GRID_VIEW: {
      const currentTask = state.tasks[action.taskId];
      const { metadata } = currentTask;
      const { categories } = metadata;
      const taskWithCategoriesViewToggled = {
        ...currentTask,
        metadata: {
          ...metadata,
          categories: {
            ...categories,
            gridView: action.gridView,
          },
        },
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: taskWithCategoriesViewToggled,
        },
      };
    }

    case HANDLE_EXPAND_CATEGORY: {
      const currentTask = state.tasks[action.taskId];
      const { metadata } = currentTask;
      const { categories } = metadata;
      const taskWithCategoriesExpanded = {
        ...currentTask,
        metadata: {
          ...metadata,
          categories: {
            ...categories,
            expanded: {
              ...categories.expanded,
              [action.category]: !categories.expanded[action.category],
            },
          },
        },
      };

      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: taskWithCategoriesExpanded,
        },
      };
    }

    case RESTORE_ENTIRE_FORM: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: action.form,
        },
      };
    }
    case UPDATE_CONTACTLESS_TASK: {
      return {
        ...state,
        tasks: {
          ...state.tasks,
          [action.taskId]: {
            ...state.tasks[action.taskId],
            contactlessTask: action.payload,
          },
        },
      };
    }

    default:
      return state;
  }
}
