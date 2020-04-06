const callTypes = {
  child: 'Child calling about self',
  caller: 'Someone calling about a child',
  silent: 'Silent',
  blank: 'Blank',
  joke: 'Joke',
  hangup: 'Hang up',
  wrongnumber: 'Wrong Number',
  abusive: 'Abusive',
};

export const isNonDataCallType = callType => ![callTypes.child, callTypes.caller].includes(callType);

export default callTypes;
