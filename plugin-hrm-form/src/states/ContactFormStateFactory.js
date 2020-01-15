import cloneDeep from 'lodash/cloneDeep';
export const ValidationType = {
  REQUIRED: 'REQUIRED'
};
export const FieldType = {
  CALL_TYPE: 'CALL_TYPE',
  CHECKBOX: 'CHECKBOX',
  CHECKBOX_FIELD: 'CHECKBOX_FIELD',
  INTERMEDIATE: 'INTERMEDIATE',
  SELECT_SINGLE: 'SELECT_SINGLE',
  TAB: 'TAB',
  TEXT_BOX: 'TEXT_BOX',
  TEXT_INPUT: 'TEXT_INPUT'
};

const defaultFormDefinition = {
  callType: {
    type: FieldType.CALL_TYPE
  },
  callerInformation: {
    type: FieldType.TAB,
    name: {
      type: FieldType.INTERMEDIATE,
      firstName: {
        type: FieldType.TEXT_INPUT,
        validation: [ ValidationType.REQUIRED ]
      },
      lastName: {
        type: FieldType.TEXT_INPUT,
        validation: null
      }
    },
    relationshipToChild: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    gender: {
      type: FieldType.SELECT_SINGLE,
      validation: [ ValidationType.REQUIRED ]
    },
    age: {
      type: FieldType.SELECT_SINGLE,
      validation: [ ValidationType.REQUIRED ]
    },
    language: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    nationality: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    ethnicity: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    location: {
      type: FieldType.INTERMEDIATE,
      streetAddress: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      city: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      stateOrCounty: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      postalCode: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      phone1: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      phone2: {
        type: FieldType.TEXT_INPUT,
        validation: null
      }
    }
  },
  childInformation: {
    type: FieldType.TAB,
    name: {
      type: FieldType.INTERMEDIATE,
      firstName: {
        type: FieldType.TEXT_INPUT,
        validation: [ ValidationType.REQUIRED ]
      },
      lastName: {
        type: FieldType.TEXT_INPUT,
        validation: null
      }
    },
    gender: {
      type: FieldType.SELECT_SINGLE,
      validation: [ ValidationType.REQUIRED ]
    },
    age: {
      type: FieldType.SELECT_SINGLE,
      validation: [ ValidationType.REQUIRED ]
    },
    language: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    nationality: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    ethnicity: {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    school: {
      name: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      gradeLevel: {
        type: FieldType.TEXT_INPUT,
        validation: null
      }
    },
    location: {
      type: FieldType.INTERMEDIATE,
      streetAddress: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      city: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      stateOrCounty: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      postalCode: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      phone1: {
        type: FieldType.TEXT_INPUT,
        validation: null
      },
      phone2: {
        type: FieldType.TEXT_INPUT,
        validation: null
      }
    },
    refugee: {
      type: FieldType.CHECKBOX,
      value: false
    },
    disabledOrSpecialNeeds: {
      type: FieldType.CHECKBOX,
      value: false
    },
    hiv: {
      type: FieldType.CHECKBOX,
      value: false
    }
  },
  caseInformation: {
    type: FieldType.TAB,
    categories: {
      type: FieldType.CHECKBOX_FIELD,
      validation: [ ValidationType.REQUIRED ],
      category1: {
        sub1: false,
        sub2: false,
        sub3: false,
        sub4: false,
        sub5: false,
        sub6: false,
      },
      category2: {
        sub1: false,
        sub2: false,
        sub3: false,
        sub4: false,
        sub5: false,
        sub6: false,
      }
    },
    callSummary: {
      type: FieldType.TEXT_BOX,
      validation: null
    },
    referredTo:  {
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    status:  {
      value: 'In Progress',
      type: FieldType.SELECT_SINGLE,
      validation: null
    },
    keepConfidential: {
      type: FieldType.CHECKBOX,
      value: true
    },
    okForCaseWorkerToCall: {
      type: FieldType.CHECKBOX,
      value: false
    },
    howDidTheChildHearAboutUs: '',
    didYouDiscussRightsWithTheChild: {
      type: FieldType.CHECKBOX,
      value: false
    },
    didTheChildFeelWeSolvedTheirProblem: {
      type: FieldType.CHECKBOX,
      value: false
    },
    wouldTheChildRecommendUsToAFriend: {
      type: FieldType.CHECKBOX,
      value: false
    }
  }
};

export const generateInitialFormState = (formDefinition = defaultFormDefinition) => {
  let initialState = {};
  Object.keys(formDefinition).filter(key => (key !== 'type')).forEach(key => {
    switch (formDefinition[key].type) {
      case FieldType.CALL_TYPE:
        initialState[key] = {
          ...formDefinition[key],
          value: ''
        };
        break;
      case FieldType.CHECKBOX:
        initialState[key] = {
          value: false,  // set default of false if not overridden
          ...formDefinition[key]
        };
        break;
      case FieldType.CHECKBOX_FIELD:
        initialState[key] = cloneDeep(formDefinition[key]);
        initialState[key].error = null;
        break;
      case FieldType.INTERMEDIATE:
      case FieldType.TAB:
        initialState[key] = {
          ...generateInitialFormState(formDefinition[key]),
          type: formDefinition[key].type
        };
        break;
      case FieldType.SELECT_SINGLE:
      case FieldType.TEXT_BOX:
      case FieldType.TEXT_INPUT:
        initialState[key] = {
          value: '',  // set default of empty if not overridden
          ...formDefinition[key],
          touched: false,
          error: null
        };
        break;
      default:
        throw new Error(`Unknown FieldType ${formDefinition[key].type} for key ${key} in ${JSON.stringify(formDefinition)}`);
    }
  });
  return initialState;
}
