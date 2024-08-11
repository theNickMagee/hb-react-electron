const handleKeyPressed = (
  keyLetter,
  sessionData,
  setSessionData,
  data,
  setData,
) => {
  console.log('key pressed: ', keyLetter.key === 'x');
  // if keyLetter is 'p', play the circuit
  // get 'key;

  console.log('sessionData: ', sessionData.options.currentEditItem);
  // if (keyLetter.key === 'x') {
  //   if (!sessionData.options.currentEditItem) {
  //     return;
  //   }
  //   console.log('deleting hovered events', sessionData.options.currentEditItem);

  //   // find the option thatis component: PianoRoll
  //   const pianoRollOption = sessionData.options.currentEditItem.options.find(
  //     (option) => option.component === 'PianoRoll',
  //   );

  //   // get events

  //   const events = pianoRollOption.value.events;

  //   // delete hovered events
  //   const newEventsFiltered = [...events].filter((event) => !event.hovered);

  //   setSessionData({
  //     ...sessionData,
  //     options: {
  //       ...sessionData.options,
  //       currentEditItem: {
  //         ...sessionData.options.currentEditItem,
  //         options: sessionData.options.currentEditItem.options.map((option) => {
  //           if (option.component === 'PianoRoll') {
  //             return {
  //               ...option,
  //               value: {
  //                 ...option.value,
  //                 events: [...newEventsFiltered],
  //               },
  //             };
  //           }
  //           return option;
  //         }),
  //       },
  //     },
  //   });

  //   // update data
  //   setData({
  //     ...data,
  //     boardObjects: data.boardObjects.map((obj) => {
  //       if (
  //         obj.row === sessionData.options.currentEditItem.row &&
  //         obj.col === sessionData.options.currentEditItem.col
  //       ) {
  //         return {
  //           ...obj,
  //           options: obj.options.map((option) => {
  //             if (option.component === 'PianoRoll') {
  //               return {
  //                 ...option,
  //                 value: {
  //                   ...option.value,
  //                   events: [...newEventsFiltered],
  //                 },
  //               };
  //             }
  //             return option;
  //           }),
  //         };
  //       }
  //       return obj;
  //     }),
  //   });
  // }
};

export { handleKeyPressed };
