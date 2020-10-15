import { omit } from 'lodash';

import {
  HANDLE_BLUR,
  HANDLE_FOCUS,
  SAVE_END_MILLIS,
  PREPOPULATE_FORM_CHILD,
  PREPOPULATE_FORM_CALLER,
} from '../../states/ActionTypes';
import { recreateContactState } from '../../states/actions';
import { reduce } from '../../states/ContactState';
import { createBlankForm } from '../../states/ContactFormStateFactory';

// THE TESTS IN HERE ARE A MESS AND NEED TO BE FIXED

/*
 * describe('editedNestedField', () => {
 *   const original = {
 *     callType: '',
 *     internal: {
 *       tab: 0
 *     },
 *     callerInformation: {
 *       name: {
 *         firstName: {
 *           value: '',
 *           touched: false,
 *           error: null
 *         },
 *         lastName: ''
 *       }
 *     },
 *     childInformation: {
 *       name: {
 *         firstName: '',
 *         lastName: ''
 *       }
 *     }
 *   };
 */

/*
 *   test('edits a normal nested field', () => {
 *     const expected = {
 *       callType: '',
 *       internal: {
 *         tab: 0
 *       },
 *       callerInformation: {
 *         name: {
 *           firstName: {
 *             value: '',
 *             touched: false,
 *             error: null
 *           },
 *           lastName: ''
 *         }
 *       },
 *       childInformation: {
 *         name: {
 *           firstName: '',
 *           lastName: 'aNewLastName'
 *         }
 *       }
 *     };
 *     expect(editNestedField(original, ['childInformation', 'name'], 'lastName', 'aNewLastName'))
 *       .toStrictEqual(expected);
 *   });
 */

/*
 *   test('edits callerInformation firstName all special like', () => {
 *     const expected = {
 *       callType: '',
 *       internal: {
 *         tab: 0
 *       },
 *       callerInformation: {
 *         name: {
 *           firstName: {
 *             value: 'aNewFirstName',
 *             touched: false,
 *             error: null
 *           },
 *           lastName: ''
 *         }
 *       },
 *       childInformation: {
 *         name: {
 *           firstName: '',
 *           lastName: ''
 *         }
 *       }
 *     };
 *     expect(editNestedField(original, ['callerInformation', 'name'], 'firstName', 'aNewFirstName'))
 *       .toStrictEqual(expected);
 *   })
 * });
 */

describe('reduce', () => {
  test('HANDLE_BLUR updates the whole form', () => {
    const initialState = {
      tasks: {
        WT1234: {
          callType: '',
          internal: {
            tab: 0,
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: true,
                error: null,
              },
              lastName: '',
            },
          },
          childInformation: {
            name: {
              firstName: '',
              lastName: '',
            },
          },
        },
      },
    };
    const form = {
      callType: '',
      internal: {
        tab: 0,
      },
      callerInformation: {
        name: {
          firstName: {
            value: '',
            touched: true,
            error: 'This field is required',
          },
          lastName: '',
        },
      },
      childInformation: {
        name: {
          firstName: '',
          lastName: '',
        },
      },
    };
    const action = {
      type: HANDLE_BLUR,
      form,
      taskId: 'WT1234',
    };
    expect(reduce(initialState, action)).toStrictEqual({
      tasks: {
        WT1234: form,
      },
    });
  });

  test('HANDLE_FOCUS updates touched', () => {
    const initialState = {
      tasks: {
        WT1234: {
          callType: '',
          internal: {
            tab: 0,
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: false,
                error: null,
              },
              lastName: '',
            },
          },
          childInformation: {
            name: {
              firstName: '',
              lastName: '',
            },
          },
        },
      },
    };
    const action = {
      type: HANDLE_FOCUS,
      parents: ['callerInformation', 'name'],
      name: 'firstName',
      taskId: 'WT1234',
    };
    const expected = {
      tasks: {
        WT1234: {
          callType: '',
          internal: {
            tab: 0,
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: true,
                error: null,
              },
              lastName: '',
            },
          },
          childInformation: {
            name: {
              firstName: '',
              lastName: '',
            },
          },
        },
      },
    };
    expect(reduce(initialState, action)).toStrictEqual(expected);
  });

  test('SAVE_END_MILIS works fine with a defined form', () => {
    const initialState = {
      tasks: {
        WT1234: {
          callType: '',
          internal: {
            tab: 0,
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: false,
                error: null,
              },
              lastName: '',
            },
          },
          childInformation: {
            name: {
              firstName: '',
              lastName: '',
            },
          },
          metadata: {
            recreated: false,
            startMillis: new Date().getTime(),
            endMillis: null,
          },
        },
      },
    };

    const action = {
      type: SAVE_END_MILLIS,
      taskId: 'WT1234',
    };

    const expected = {
      tasks: {
        WT1234: {
          callType: '',
          internal: {
            tab: 0,
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: false,
                error: null,
              },
              lastName: '',
            },
          },
          childInformation: {
            name: {
              firstName: '',
              lastName: '',
            },
          },
        },
      },
    };

    // omit metadata because we can't know the exact time of form creation (metadata.startMillis)
    const result = reduce(initialState, action);
    const { WT1234 } = result.tasks;
    const testTask = omit(WT1234, 'metadata');
    const testState = { tasks: { ...result.tasks, WT1234: testTask } };
    expect(testState).toStrictEqual(expected);
    expect(WT1234.metadata).toEqual(
      expect.objectContaining({
        startMillis: expect.any(Number),
        endMillis: expect.any(Number),
        recreated: false,
      }),
    );
  });

  test('SAVE_END_MILIS works fine with undefined form', () => {
    const initialState = {
      tasks: {},
    };

    const action = {
      type: SAVE_END_MILLIS,
      taskId: 'WT1234',
    };

    /*
     * omit metadata because we can't know the exact time of form creation (metadata.startMillis)
     * the whole form is not tested for strict equality
     * as it will have "defaultDefinition" (because is recreated)
     */
    const result = reduce(initialState, action);
    const { WT1234 } = result.tasks;
    expect(WT1234.metadata).toEqual(
      expect.objectContaining({
        startMillis: null,
        endMillis: expect.any(Number),
        recreated: true,
      }),
    );
  });

  let state;
  test('RECREATE_CONTACT_STATE works fine with undefined form', () => {
    const initialState = {
      tasks: {},
    };

    const action = recreateContactState('WT1234');

    const result = reduce(initialState, action);
    const { WT1234 } = result.tasks;

    expect(omit(WT1234, 'metadata')).toStrictEqual(omit(createBlankForm(), 'metadata'));
    expect(WT1234.metadata.startMillis).toBeNull();
    expect(WT1234.metadata.recreated).toBeTruthy();

    state = result;
  });

  test('RECREATE_CONTACT_STATE does nothing with existing form', () => {
    expect(state.tasks.WT1234.callerInformation.name.firstName.touched).toBeFalsy();

    const result1 = reduce(state, {
      type: HANDLE_FOCUS,
      parents: ['callerInformation', 'name'],
      name: 'firstName',
      taskId: 'WT1234',
    });

    expect(result1.tasks.WT1234.callerInformation.name.firstName.touched).toBeTruthy();

    const action = recreateContactState('WT1234');
    const result2 = reduce(result1, action);
    const { WT1234 } = result2.tasks;

    // if this remains truthy after recreateContactState, the form was not touched by the action
    expect(WT1234.callerInformation.name.firstName.touched).toBeTruthy();
  });

  test('PREPOPULATE_FORM_CHILD alters only the fields it should', () => {
    const initialState = {
      tasks: {
        WT1234: {
          callType: {
            value: 'Child calling about self',
          },
          callerInformation: {
            name: '',
          },
          childInformation: {
            name: {
              firstName: {
                value: '',
                touched: false,
                error: null,
              },
              lastName: '',
            },
            gender: {
              value: '',
              touched: false,
              error: null,
            },
            age: {
              value: '',
              touched: false,
              error: null,
            },
          },
        },
        WT5678: {
          callType: {
            value: 'Someone calling about a child',
          },
        },
      },
    };

    const action = {
      type: PREPOPULATE_FORM_CHILD,
      gender: 'Boy',
      age: 'Unknown',
      taskId: 'WT1234',
    };

    const expectedTasks = {
      WT1234: {
        callType: {
          value: 'Child calling about self',
        },
        callerInformation: {
          name: '',
        },
        childInformation: {
          name: {
            firstName: {
              value: '',
              touched: false,
              error: null,
            },
            lastName: '',
          },
          gender: {
            value: 'Boy',
            touched: false,
            error: null,
          },
          age: {
            value: 'Unknown',
            touched: false,
            error: null,
          },
        },
      },
      WT5678: {
        callType: {
          value: 'Someone calling about a child',
        },
      },
    };

    const result = reduce(initialState, action);
    const { tasks } = result;

    expect(tasks).toEqual(expectedTasks);
  });

  test('PREPOPULATE_FORM_CALLER alters only the fields it should', () => {
    const initialState = {
      tasks: {
        WT1234: {
          callType: {
            value: 'Someone calling about a child',
          },
          callerInformation: {
            name: {
              firstName: {
                value: '',
                touched: false,
                error: null,
              },
              lastName: '',
            },
            gender: {
              value: '',
              touched: false,
              error: null,
            },
            age: {
              value: '',
              touched: false,
              error: null,
            },
          },
          childInformation: {
            name: '',
          },
        },
        WT5678: {
          callType: {
            value: 'Someone calling about a child',
          },
        },
      },
    };

    const action = {
      type: PREPOPULATE_FORM_CALLER,
      gender: 'Girl',
      age: '18-25',
      taskId: 'WT1234',
    };

    const expectedTasks = {
      WT1234: {
        callType: {
          value: 'Someone calling about a child',
        },
        callerInformation: {
          name: {
            firstName: {
              value: '',
              touched: false,
              error: null,
            },
            lastName: '',
          },
          gender: {
            value: 'Girl',
            touched: false,
            error: null,
          },
          age: {
            value: '18-25',
            touched: false,
            error: null,
          },
        },
        childInformation: {
          name: '',
        },
      },
      WT5678: {
        callType: {
          value: 'Someone calling about a child',
        },
      },
    };

    const result = reduce(initialState, action);
    const { tasks } = result;

    expect(tasks).toEqual(expectedTasks);
  });
});
