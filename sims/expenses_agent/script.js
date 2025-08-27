document.addEventListener('DOMContentLoaded', ()=>{
  const messagesEl = document.getElementById('messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');

  // Samples: buttons that populate the input and add a pending user message (not submitted)
  const sampleBtns = document.querySelectorAll('.sample-btn');
  let pendingLi = null;
  let awaitingSubmitConfirmation = false;
  let awaitingSubmitDetails = false;

  // find the scrollable chat container and scroll to bottom
  function getChatContainer(){
    return messagesEl.closest('.chat') || messagesEl.parentElement || document.documentElement;
  }

  function scrollToBottom(smooth=false){
    const container = getChatContainer();
    if(!container) return;
    try{
      if(smooth && container.scrollTo){
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
      } else if(container.scrollTop !== undefined){
        container.scrollTop = container.scrollHeight;
      } else {
        window.scrollTo(0, container.scrollHeight);
      }
    }catch(e){
      try{ container.scrollTop = container.scrollHeight; }catch(e2){}
    }
  }

  // Responses (exact text comes from the spec)
  const RESPONSES = {
    meal: 'The maximum allowable expense for a meal is $75.00.',
    hotel: 'The maximum allowable expense for accommodation is $200.00 per night.',
    submit: 'To submit an expense claim, you can just send details and the amounts to be claimed to expenses@contoso.com. Would you like me to submit a claim on your behalf?',
    flight: 'The maximum allowable expense for a flight is $600',
    taxi: 'The maximum allowable expense for a taxi or ride-share is $50.',
    greeting: 'Hi. How can I help?',
    capabilities: 'I can help you with information and guidelines for expense claims.',
    thanks: 'You\'re welcome. Anything else I can help with?',
    goodbye: 'Goodbye!'
  };

  // normalize text for matching
  function normalize(text){
    return text.toLowerCase().replace(/["'`]/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function matchIntent(text){
    const t = normalize(text);

    const has = (re) => re.test(t);

    // Greeting: hello, hi, hey, good morning/afternoon/evening
    if(has(/\b(hello|hi|hey|hiya|greetings|good\s+morning|good\s+afternoon|good\s+evening)\b/)){
      return 'greeting';
    }

    // "What can you do?" / capabilities
    if(has(/\bwhat (can|do)\b/) && has(/\b(you|u)\b/)){
      return 'capabilities';
    }

    // Thanks
    if(has(/\b(thanks|thank you|thx|ty)\b/)){
      return 'thanks';
    }

    // Goodbye
    if(has(/\b(goodbye|bye|see you|see ya|farewell)\b/)){
      return 'goodbye';
    }

    // Meal-related: contains meal/food and a question about maximum/claim
    if(has(/\b(meal|meals|food|lunch|dinner|snack)\b/) && has(/\b(max|maximum|allow|allowable|claim|limit|how much)\b/)){
      return 'meal';
    }

    // Hotel-related: hotel, accommodation, stay, room, lodging
    if(has(/\b(hotel|accommodation|stay|room|lodging)\b/) && has(/\b(max|maximum|allow|allowable|claim|limit|night|per night)\b/)){
      return 'hotel';
    }

    // Taxi / ride-share: taxi, cab, Uber, Lyft, ride share
    if((has(/\b(taxi|cab|uber|lyft|rideshare)\b/) || has(/\b(ride\s+share)\b/)) && has(/\b(max|maximum|allow|allowable|claim|limit|how much)\b/)){
      return 'taxi';
    }

    // Flight-related: flight, airfare, plane, ticket
    if(has(/\b(flight|airfare|airline|plane|ticket)\b/) && has(/\b(max|maximum|allow|allowable|claim|limit|how much)\b/)){
      return 'flight';
    }

    // Submit-related: how to submit / where to send / receipt(s)
    if((has(/\b(submit|how do i submit|how to submit|how to|how do i|where do i|send|file|process)\b/) && has(/\b(expense|claim|receipt|receipts|expense claim)\b/)) || has(/\b(expense claim|how to submit an expense)\b/)){
      return 'submit';
    }

    return null;
  }

  function isAffirmative(text){
    const t = normalize(text);
    return /\b(yes|y|yeah|yep|sure|ok|okay|please do|please|affirmative|go ahead|do it|alright|surely)\b/.test(t);
  }

  function isNegative(text){
    const t = normalize(text);
    return /\b(no|nope|nah|not|dont|do not|cancel|stop|never)\b/.test(t);
  }

  // create and append a message element
  function appendMessage(role, text){
    const li = document.createElement('li');
    li.className = 'message ' + (role === 'user' ? 'user' : 'assistant');
    li.setAttribute('role','listitem');
    li.innerHTML = `<div class="bubble"></div>`;
    const bubble = li.querySelector('.bubble');
    messagesEl.appendChild(li);
    // ensure newly added message is visible
    try{
      li.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }catch(e){
      scrollToBottom(true);
    }
    return bubble;
  }

  // animate typing effect into element
  function typeText(el, text, speed=20){
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      const timer = setInterval(()=>{
        el.textContent += text.charAt(i);
        i++;
        // make sure the growing bubble stays visible
        scrollToBottom(false);
        if(i >= text.length){
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  // show typing indicator
  function showTyping(){
    const bubble = appendMessage('assistant', '');
    bubble.classList.add('assistant');
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    bubble.appendChild(typing);
    scrollToBottom(true);
    return bubble;
  }

  async function sendAssistantMessage(response){
    const typingEl = showTyping();
    await new Promise(r => setTimeout(r, 500));
    typingEl.remove();
    const bubble = appendMessage('assistant', '');
    const bubbleText = document.createElement('div');
    bubble.appendChild(bubbleText);
    await typeText(bubbleText, response, 28);
  }

  async function respondTo(text){
    // determine intent
    const intent = matchIntent(text);
    const response = intent ? RESPONSES[intent] : "I'm sorry. I didn't understand your question. Please try rewording it.\nNote that I can only help with questions about expenses.";

    // show typing indicator
    const typingEl = showTyping();

    // simulate a short delay before typing
    await new Promise(r => setTimeout(r, 500));

    // remove typing indicator and type response
    typingEl.remove();
    const bubble = appendMessage('assistant', '');
    const bubbleText = document.createElement('div');
    bubble.appendChild(bubbleText);

    // type the response
    await typeText(bubbleText, response, 28);

    return intent;
  }

  function addPendingSample(text){
    // populate the input only (do not add a preview message)
    input.value = text;
    input.focus();
  }

  sampleBtns.forEach(btn => {
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const sample = btn.dataset.sample || btn.textContent || '';
      addPendingSample(sample);
    });
  });

  // keep the pending preview in sync with input edits; remove if input cleared
  input.addEventListener('input', ()=>{
    if(!pendingLi) return;
    const bubble = pendingLi.querySelector('.bubble');
    if(!input.value || input.value.trim() === ''){
      pendingLi.remove();
      pendingLi = null;
    } else {
      bubble.textContent = input.value;
    }
  });

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;

    // remove pending preview (if any) to avoid duplicate
    if(pendingLi){ pendingLi.remove(); pendingLi = null; }

    // add user message
    const userBubble = appendMessage('user', '');
    userBubble.textContent = text;
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    // handle stateful submit flow
    if(awaitingSubmitConfirmation){
      if(isNegative(text)){
        await sendAssistantMessage('OK. How can I help you?');
        awaitingSubmitConfirmation = false;
        awaitingSubmitDetails = false;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        return;
      }
      if(isAffirmative(text)){
        await sendAssistantMessage('Please enter the details and amounts to be claimed.');
        awaitingSubmitConfirmation = false;
        awaitingSubmitDetails = true;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        return;
      }
      // otherwise fall through to normal handling
    }

    if(awaitingSubmitDetails){
      if(isNegative(text)){
        await sendAssistantMessage('OK. How can I help you?');
        awaitingSubmitConfirmation = false;
        awaitingSubmitDetails = false;
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        return;
      }

      // user provided details - send the email (simulated)
      await sendAssistantMessage('Thanks. I\'ve sent an email to expenses@contoso.com on your behalf. You\'ll receive a confirmation email within 24 hours. You may be asked to provide more information and/or receipts.');
      awaitingSubmitConfirmation = false;
      awaitingSubmitDetails = false;
      input.disabled = false;
      sendBtn.disabled = false;
      input.focus();
      return;
    }

    // default behaviour
    const intent = await respondTo(text);

    if(intent === 'submit'){
      awaitingSubmitConfirmation = true;
    } else {
      awaitingSubmitConfirmation = false;
      awaitingSubmitDetails = false;
    }

    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  });

  // allow enter in input to submit
  input.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); form.requestSubmit(); } });

  // initial prompt
  (async ()=>{
    const bubble = appendMessage('assistant', '');
    const bubbleText = document.createElement('div');
    bubble.appendChild(bubbleText);
    await typeText(bubbleText, 'Hello — ask me about expense limits or how to submit a claim.', 24);
  })();

});
