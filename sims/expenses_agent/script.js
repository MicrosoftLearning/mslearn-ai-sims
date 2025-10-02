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
    meal: 'You can claim up to $75.00 for a meal.',
    hotel: 'The maximum allowable expense for accommodation is $200.00 per night.',
    submit: 'To submit an expense claim, you can just send details and the amounts to be claimed to expenses@contoso.com. Would you like me to submit a claim on your behalf?',
    flight: 'The maximum cost that can be reimbursed for a flight is $600.00',
    taxi: 'The most you can spend on a taxi or ride-share is $50.00.',
    greeting: 'Hi. How can I help?',
    capabilities: 'I can help you with information and guidelines for expense claims.',
    thanks: 'You\'re welcome. Anything else I can help with?',
    goodbye: 'Goodbye!'
  };

  // normalize text for matching
  function normalize(text){
    return text.toLowerCase().replace(/["'`]/g, '').replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  // Auto-correct common spelling mistakes and typos
  function autoCorrectSpelling(text){
    // Common spelling corrections - case insensitive
    const corrections = {
      // General typos
      'teh': 'the',
      'hte': 'the',
      'taht': 'that',
      'thta': 'that',
      'nad': 'and',
      'adn': 'and',
      'anf': 'and',
      'cna': 'can',
      'caan': 'can',
      'yuo': 'you',
      'recieve': 'receive',
      'recieve': 'receive',
      'seperate': 'separate',
      'definate': 'definite',
      'definately': 'definitely',
      'thier': 'their',
      'there': 'their', // context-dependent, but often correct for "their"
      'occured': 'occurred',
      'accomodate': 'accommodate',
      'acheive': 'achieve',
      'beleive': 'believe',
      'reccomend': 'recommend',
      'neccessary': 'necessary',
      'begining': 'beginning',
      'minumum': 'minimum',
      'maximun': 'maximum',
      'maxiumum': 'maximum',
      'limite': 'limit',
      'limits': 'limit', // singular for better matching
      
      // Expense-related typos
      'expence': 'expense',
      'expeses': 'expenses',
      'expence': 'expense',
      'expensess': 'expenses',
      'reimberse': 'reimburse',
      'reimburce': 'reimburse',
      'reimbursment': 'reimbursement',
      'reciept': 'receipt',
      'recipt': 'receipt',
      'recepit': 'receipt',
      'receit': 'receipt',
      'receits': 'receipts',
      'reciepts': 'receipts',
      'recipts': 'receipts',
      'clame': 'claim',
      'claime': 'claim',
      'cliam': 'claim',
      'submite': 'submit',
      'sumbit': 'submit',
      'sumbmit': 'submit',
      'sumit': 'submit',
      
      // Accommodation typos
      'hotell': 'hotel',
      'accomodation': 'accommodation',
      'acommodation': 'accommodation',
      'acomodation': 'accommodation',
      'lodgeing': 'lodging',
      
      // Meal typos
      'meale': 'meal',
      'males': 'meals',
      'mealls': 'meals',
      'resturant': 'restaurant',
      'restaraunt': 'restaurant',
      'restauraunt': 'restaurant',
      'restraunt': 'restaurant',
      'luch': 'lunch',
      'luncg': 'lunch',
      'diner': 'dinner',
      'breakfest': 'breakfast',
      'brekfast': 'breakfast',
      
      // Transportation typos
      'flite': 'flight',
      'fligt': 'flight',
      'airfair': 'airfare',
      'airfaire': 'airfare',
      'airfar': 'airfare',
      'taksi': 'taxi',
      'texsi': 'taxi',
      'taxie': 'taxi',
      'ubar': 'uber',
      'uber': 'Uber',
      'lyft': 'Lyft',
      'rideshare': 'ride share',
      'ridesharre': 'ride share',
      
      // Question words
      'wat': 'what',
      'wht': 'what',
      'waht': 'what',
      'whta': 'what',
      'hwo': 'how',
      'hwat': 'what',
      'wen': 'when',
      'wher': 'where',
      'whre': 'where',
      'wher': 'where',
      'whic': 'which',
      'whihc': 'which',
      'wich': 'which',
      
      // Common expense amounts/numbers
      'dollers': 'dollars',
      'doller': 'dollar',
      'dollors': 'dollars',
      'dollor': 'dollar'
    };

    let correctedText = text;
    
    // Apply corrections word by word, preserving case
    Object.keys(corrections).forEach(typo => {
      const correction = corrections[typo];
      
      // Create regex that matches the typo as a whole word (case insensitive)
      const regex = new RegExp('\\b' + typo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      
      correctedText = correctedText.replace(regex, (match) => {
        // Preserve the original case pattern
        if (match === match.toUpperCase()) {
          return correction.toUpperCase();
        } else if (match[0] === match[0].toUpperCase()) {
          return correction.charAt(0).toUpperCase() + correction.slice(1).toLowerCase();
        } else {
          return correction.toLowerCase();
        }
      });
    });
    
    return correctedText;
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

    // Check for expense-related questions with multiple items
    if(has(/\b(max|maximum|allow|allowable|claim|limit|how much|spend|what about|how about)\b/)){
      const expenseTypes = [];
      
      // Meal-related: contains meal/food
      if(has(/\b(meal|meals|food|lunch|dinner|snack|restaurant|breakfast)\b/)){
        expenseTypes.push('meal');
      }

      // Hotel-related: hotel, accommodation, stay, room, lodging
      if(has(/\b(hotel|hotels|accommodation|stay|room|rooms|lodging)\b/)){
        expenseTypes.push('hotel');
      }

      // Taxi / ride-share: taxi, cab, Uber, Lyft, ride share
      if((has(/\b(taxi|cab|uber|lyft|rideshare|lift)\b/) || has(/\b(ride\s+share)\b/))){
        expenseTypes.push('taxi');
      }

      // Flight-related: flight, airfare, plane, ticket
      if(has(/\b(flight|flights|airfare|airline|plane|ticket)\b/)){
        expenseTypes.push('flight');
      }

      // If multiple expense types found, return them as an array
      if(expenseTypes.length > 1){
        return expenseTypes;
      } else if(expenseTypes.length === 1){
        return expenseTypes[0];
      }
    }

    // Submit-related: how to submit / where to send / receipt(s)
    if((has(/\b(submit|how do i submit|how to submit|how to|how do i|where do i|send|file|process)\b/) && has(/\b(expense|claim|receipt|receipts|expense claim)\b/)) || has(/\b(expense claim|how to submit an expense|get reimbursed)\b/)){
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
    // preserve line breaks if message contains newline characters so it looks like an email
    if(response && response.indexOf('\n') !== -1){
      bubbleText.style.whiteSpace = 'pre-wrap';
    }
    bubble.appendChild(bubbleText);
    await typeText(bubbleText, response, 28);
  }

  async function respondTo(text){
    // determine intent
    const intent = matchIntent(text);
    let response;
    
    // Handle multiple expense types
    if(Array.isArray(intent)){
      const responses = intent.map(type => RESPONSES[type]);
      response = responses.join('\n');
    } else {
      response = intent ? RESPONSES[intent] : "I'm sorry. I didn't understand your question. Please try rewording it.\nNote that I can only help with questions about expenses.";
    }

    // show typing indicator
    const typingEl = showTyping();

    // simulate a short delay before typing
    await new Promise(r => setTimeout(r, 500));

    // remove typing indicator and type response
    typingEl.remove();
    const bubble = appendMessage('assistant', '');
    const bubbleText = document.createElement('div');
    
    // preserve line breaks for multiple responses
    if(response && response.indexOf('\n') !== -1){
      bubbleText.style.whiteSpace = 'pre-wrap';
    }
    
    bubble.appendChild(bubbleText);

    // type the response
    await typeText(bubbleText, response, 28);

    return Array.isArray(intent) ? intent : intent;
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
    const originalText = input.value.trim();
    if(!originalText) return;

    // Auto-correct spelling mistakes
    const correctedText = autoCorrectSpelling(originalText);
    const wasCorrected = originalText !== correctedText;

    // remove pending preview (if any) to avoid duplicate
    if(pendingLi){ pendingLi.remove(); pendingLi = null; }

    // add user message (show corrected text if different)
    const userBubble = appendMessage('user', '');
    userBubble.textContent = correctedText;
    
    // If text was corrected, add a subtle indicator
    if(wasCorrected) {
      userBubble.title = `Original: "${originalText}"`;
      userBubble.style.borderLeft = '2px solid #4CAF50';
      userBubble.style.paddingLeft = '8px';
    }
    
    input.value = '';
    input.disabled = true;
    sendBtn.disabled = true;

    // Use corrected text for all processing
    const text = correctedText;

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

      // Validate that the user entered both a description (some letters) and at least one numeric amount
      const hasDescription = /[A-Za-z\u00C0-\u024F]/.test(text);
      const hasAmount = /(?:\$|£|€)?\s*\d+(?:[.,]\d{1,2})?/.test(text);

      if(!hasDescription || !hasAmount){
        await sendAssistantMessage('I didn\'t detect both a description and a numeric amount. Please enter the details and amounts to be claimed (for example: "Lunch with client $45.00"). If you don\'t want to continue, reply "No".');
        // keep awaitingSubmitDetails = true so we loop until valid or cancelled
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
        return;
      }

      // user provided valid details - send the email (simulated)
      // show typing indicator, then insert a formatted message that looks like an email
      const typingEl = showTyping();
      await new Promise(r => setTimeout(r, 500));
      typingEl.remove();

      const bubble = appendMessage('assistant', '');
      const container = document.createElement('div');

      // intro sentence
      const intro = document.createElement('div');
      intro.textContent = "Thanks. I've sent an email to expenses@contoso.com on your behalf.";
      container.appendChild(intro);

      // email headers with bold labels
      const headers = document.createElement('div');
      headers.style.marginTop = '8px';
      headers.innerHTML = `<div><strong>To:</strong> expenses@contoso.com</div><div><strong>Subject:</strong> Expense claim</div>`;
      // indent the headers to look like an email block
      headers.style.marginLeft = '12px';
      container.appendChild(headers);

      // email content (preserve newlines)
      const content = document.createElement('div');
      content.style.whiteSpace = 'pre-wrap';
      content.style.marginTop = '8px';
      // indent the content to align with headers
      content.style.marginLeft = '12px';
      content.textContent = text;
      container.appendChild(content);

      // footer
      const footer = document.createElement('div');
      footer.style.marginTop = '8px';
      footer.textContent = "You'll receive a confirmation email within 24 hours. You may be asked to provide more information and/or receipts.";
      container.appendChild(footer);

      bubble.appendChild(container);
      // ensure the newly added, taller message is visible
      scrollToBottom(true);

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
