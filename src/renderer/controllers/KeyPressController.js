

const handleKeyPressed = (keyLetter, sessionData, setSessionData, data, setData)  =>
{
  console.log('key pressed: ', keyLetter);
  // if keyLetter is 'p', play the circuit
  if (keyLetter === 'x') {
    // loop thru activeBoardObject.options.events if it exists, find the event with hovered = true, delete
    const events = sessionData.activeBoardObject.options.events;

    if !events {
      return;
    }

    const newEvents = events.filter((event) => !event.hovered);
  }
}