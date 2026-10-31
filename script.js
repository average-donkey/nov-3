
const PERSONAL = {
  intro: `HIIII BROSKI!!

Soooo, for Day 03, I wanted to make you something to enjoy.(cause i am very creative)

Because apparently receiving birthday countdown websites wasn't enough,so you now have an entire arcade to deal with.

You're welcome.`,
  letterGreeting: "HIIII !!",
  letterBody: `Daily reminder- physics is soo cool.

I made you a tiny arcade because one website per day apparently wasn't enough chaos and timepass. I hope you have fun with it, even if the slot machine decides to personally humble you 😊.

Anyway, here's your reminder that you're an important part of this very unserious little universe. Have fun, be yourself, and please do not sue me for stalking pls.`,
  letterSignoff: "Your favourite coder (probably)",
  everydaySecret: `SECRET UNLOCKED: Which is well you guessed it a msg and that is "YOU ARE BAUNA". ✦`,
  popRewardTitle: "CONGRATULATIONS!!",
  popRewardMessage: "You have officially demonstrated excellent tapping abilities.we are mildly concerned.",
  slotRewardTitle: "THE LUCKY LEGEND!",
  slotRewardMessage: "The machine has reviewed your performance and decided you deserve a very beautifully made  birthday countdown made by a very handsome coder.",
  birthdayTitle: "IT'S YOUR BIRTHDAY!",
  birthdayMessage: "HAPPY BIRTHDAY, BROMINE Today the world belongs to you. May your day be full of excellent snacks, peakkkk nonsense, and people reminding you how appreciated you are.",
  birthdaySecret: "BIRTHDAY-ONLY SECRET: You have unlocked the legendary +100 hours of being annoyed by me Redeem immediately. ★",

  birthdayTestNow: null
};


(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const pages = {home:$("homePage"), arcade:$("arcadePage"), letter:$("letterPage")};
  const modals = {select:$("selectModal"), game:$("gameModal"), reward:$("rewardModal")};
  const audio = {music:$("bgMusic"), pop:$("popSound"), spin:$("spinSound"), win:$("winSound")};
  const symbols = ["★","♥","🍒","7","♦","✿"];
  let musicOn = false, popTimer = null, popInterval = null, popScore = 0, popBest = 0, popTime = 30;
  let activeHole = -1, popRunning = false, slotSpins = 0, slotBusy = false, slotFinished = false;
  let birthdayVisible = false, slotTimeouts = [], slotIntervals = [];

  function setText(id, value){ $(id).textContent = value; }
  function showPage(name){
    Object.entries(pages).forEach(([key,el])=>el.classList.toggle("active",key===name));
    window.scrollTo({top:0,behavior:"smooth"});
  }
  function openModal(name){ modals[name].classList.add("open"); modals[name].setAttribute("aria-hidden","false"); }
  function closeModal(name){
    modals[name].classList.remove("open"); modals[name].setAttribute("aria-hidden","true");
    if(name==="game"){stopPopGame();stopSlotAnimations();}
  }
  function stopSlotAnimations(){
    slotIntervals.forEach(clearInterval);slotTimeouts.forEach(clearTimeout);
    slotIntervals=[];slotTimeouts=[];slotBusy=false;
    for(let i=0;i<3;i++)$("reel"+i).classList.remove("spinning");
  }
  function playSound(name){
    const a=audio[name]; if(!a) return;
    try{a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>{});}catch(_){}
  }
  function stopSound(name){try{audio[name].pause();audio[name].currentTime=0;}catch(_){}}
  function setMusic(on){
    musicOn=on; $("musicToggle").setAttribute("aria-pressed",String(on));
    setText("musicLabel",on?"MUSIC ON":"MUSIC OFF");
    if(on){audio.music.volume=.23;const p=audio.music.play();if(p&&p.catch)p.catch(()=>{musicOn=false;$("musicToggle").setAttribute("aria-pressed","false");setText("musicLabel","MUSIC OFF");});}
    else stopSound("music");
  }
  function startMusicFromGesture(){if(!musicOn)setMusic(true);}
  function setPersonalContent(){
    setText("introText",PERSONAL.intro);setText("letterGreeting",PERSONAL.letterGreeting);
    setText("letterBody",PERSONAL.letterBody);setText("letterSignoff",PERSONAL.letterSignoff);
    setText("everydaySecret",PERSONAL.everydaySecret);setText("birthdayTitle",PERSONAL.birthdayTitle);
    setText("birthdayMessage",PERSONAL.birthdayMessage);setText("birthdaySecret",PERSONAL.birthdaySecret);
  }
  function openGameSelect(){startMusicFromGesture();openModal("select");}
  function launchGame(which){
    closeModal("select");openModal("game");
    $("popGame").hidden=which!=="pop";$("slotGame").hidden=which!=="slot";
    if(which==="pop") resetPopGame(); else resetSlotGame();
  }
  function showReward(title,message,result){
    setText("rewardTitle",title);setText("rewardMessage",message);setText("rewardResult",result||"");openModal("reward");
    playSound("win");
  }
  function returnToArcade(){closeModal("reward");closeModal("game");showPage("arcade");}

  // Shin-chan Pop: only one active target; only target buttons score.
  function buildPopGrid(){
    const grid=$("popGrid");grid.innerHTML="";
    for(let i=0;i<9;i++){const hole=document.createElement("div");hole.className="pop-hole";hole.dataset.hole=String(i);grid.appendChild(hole);}
  }
  function chooseHole(){
    let next=Math.floor(Math.random()*9);
    if(next===activeHole) next=(next+1+Math.floor(Math.random()*8))%9;
    activeHole=next;
    const hole=$("popGrid").children[next];hole.classList.add("active");
    const target=document.createElement("button");target.type="button";target.className="pop-target";
    target.setAttribute("aria-label","Tap Shin-chan");target.innerHTML = '<img src="assets/images/shinchan.png" alt="Shin-chan">';
    target.addEventListener("click",(event)=>{
      event.stopPropagation();if(!popRunning||activeHole!==next)return;
      popScore++;popBest=Math.max(popBest,popScore);setText("popScore",String(popScore).padStart(2,"0"));
      setText("popBest",String(popBest).padStart(2,"0"));playSound("pop");
      hole.innerHTML="";hole.classList.remove("active");activeHole=-1;chooseHole();
    });
    hole.appendChild(target);
  }
  function clearPopTarget(){if(activeHole>=0&&$("popGrid").children[activeHole]){$("popGrid").children[activeHole].innerHTML="";$("popGrid").children[activeHole].classList.remove("active");}activeHole=-1;}
  function resetPopGame(){
    stopPopGame();popScore=0;popTime=30;activeHole=-1;
    setText("popScore","00");setText("popTime","30");setText("popBest",String(popBest).padStart(2,"0"));
    setText("popStatus","Press START ROUND when you're ready!");setText("startPopBtn","START ROUND ▶");
    $("startPopBtn").disabled=false;buildPopGrid();
  }
  function stopPopGame(){
    popRunning=false;if(popTimer){clearInterval(popTimer);popTimer=null;}
    if(popInterval){clearInterval(popInterval);popInterval=null;}clearPopTarget();
  }
  function finishPopGame(){
    if(!popRunning)return;stopPopGame();setText("popStatus","TIME'S UP! Final score: "+popScore);
    $("startPopBtn").disabled=false;setText("startPopBtn","PLAY AGAIN ↻");
    showReward(PERSONAL.popRewardTitle,PERSONAL.popRewardMessage,"FINAL SCORE: "+popScore+" POINT"+(popScore===1?"":"S"));
  }
  function startPopGame(){
    resetPopGame();popRunning=true;$("startPopBtn").disabled=true;setText("popStatus","GO GO GO! TAP THE LITTLE GUY!");
    chooseHole();
    popTimer=setInterval(()=>{popTime--;setText("popTime",String(popTime).padStart(2,"0"));if(popTime<=0)finishPopGame();},1000);
  }

  // Lucky Slot: five spins exactly; lock while the reels animate.
  function resetSlotGame(){
    stopSlotAnimations();slotSpins=0;slotBusy=false;slotFinished=false;
    setText("spinsLeft","5");setText("spinNumber","0");setText("slotStatus","Five spins. One very dramatic machine.");
    $("spinBtn").disabled=false;setText("spinBtn","SPIN THE REELS ↻");
    for(let i=0;i<3;i++){$("reel"+i).textContent=symbols[(i+1)%symbols.length];$("reel"+i).classList.remove("spinning");}
  }
  function spinSlot(){
    if(slotBusy||slotFinished||slotSpins>=5)return;
    slotBusy=true;slotSpins++;setText("spinNumber",String(slotSpins));setText("spinsLeft",String(5-slotSpins));
    $("spinBtn").disabled=true;setText("slotStatus","THE MACHINE IS THINKING...");
    playSound("spin");
    for(let i=0;i<3;i++)$("reel"+i).classList.add("spinning");
    const final=symbols.map(()=>null);
    const results=Array.from({length:3},()=>symbols[Math.floor(Math.random()*symbols.length)]);
    // Use independent stop times for the familiar reel-by-reel effect.
    [650,1050,1450].forEach((delay,index)=>{
      const reel=$("reel"+index);
      const jitter=setInterval(()=>{reel.textContent=symbols[Math.floor(Math.random()*symbols.length)];},75);
      slotIntervals.push(jitter);
      const timeout=setTimeout(()=>{
        clearInterval(jitter);slotIntervals=slotIntervals.filter(t=>t!==jitter);
        reel.textContent=results[index];reel.classList.remove("spinning");
        if(index===2){
          slotBusy=false;
          const counts={};results.forEach(s=>counts[s]=(counts[s]||0)+1);
          const jackpot=results[0]===results[1]&&results[1]===results[2];
          const pair=!jackpot&&Object.values(counts).some(n=>n===2);
          if(jackpot)setText("slotStatus","JACKPOT!! THE MACHINE HAS LOST ITS MIND.");
          else if(pair)setText("slotStatus","A PAIR! The machine acknowledges your existence.");
          else setText("slotStatus","No match. The machine says: damm unlucky.");
          if(slotSpins===5){
            slotFinished=true;$("spinBtn").disabled=true;setText("spinBtn","ROUND COMPLETE ✓");
            const result=jackpot?"JACKPOT ON THE FINAL SPIN!":pair?"A PAIR ON THE FINAL SPIN!":"FIVE SPINS COMPLETE — NO JACKPOT THIS ROUND.";
            showReward(PERSONAL.slotRewardTitle,PERSONAL.slotRewardMessage,result);
          }else{
            $("spinBtn").disabled=false;setText("spinBtn","SPIN AGAIN · "+(5-slotSpins)+" LEFT");
          }
          if(jackpot)playSound("win");
        }
      },delay);
      slotTimeouts.push(timeout);
    });
  }

  // Countdown and birthday mode are based on IST calendar time, not visitor timezone.
  const IST_OFFSET=330*60*1000;
  function istParts(date){
    const shifted=new Date(date.getTime()+IST_OFFSET);
    return {year:shifted.getUTCFullYear(),month:shifted.getUTCMonth()+1,day:shifted.getUTCDate(),
      hour:shifted.getUTCHours(),minute:shifted.getUTCMinutes(),second:shifted.getUTCSeconds(),millisecond:shifted.getUTCMilliseconds()};
  }
  function istTargetUtc(year,month,day){
    // UTC timestamp corresponding to midnight IST on the supplied calendar date.
    return Date.UTC(year,month-1,day,0,0,0)-IST_OFFSET;
  }
  function getNow(){return PERSONAL.birthdayTestNow?new Date(PERSONAL.birthdayTestNow):new Date();}
  function updateCountdown(){
    const now=getNow(),p=istParts(now),isBirthday=p.month===11&&p.day===20;
    if(isBirthday){$("countdownPanel").hidden=true;activateBirthday();return;}
    $("countdownPanel").hidden=false;deactivateBirthday();
    let targetYear=p.year;
    if(p.month>11||(p.month===11&&p.day>20))targetYear++;
    const diff=Math.max(0,istTargetUtc(targetYear,11,20)-now.getTime());
    const days=Math.floor(diff/86400000),hours=Math.floor(diff%86400000/3600000),minutes=Math.floor(diff%3600000/60000),seconds=Math.floor(diff%60000/1000);
    setText("days",String(days).padStart(3,"0"));setText("hours",String(hours).padStart(2,"0"));
    setText("minutes",String(minutes).padStart(2,"0"));setText("seconds",String(seconds).padStart(2,"0"));
  }
  function makeConfetti(){
    const layer=$("confettiLayer");if(layer.childElementCount)return;
    for(let i=0;i<70;i++){const piece=document.createElement("i");piece.className="confetti-piece";
      piece.style.left=(Math.random()*100)+"%";piece.style.animationDelay=(-Math.random()*4)+"s";
      piece.style.animationDuration=(3+Math.random()*3)+"s";piece.style.setProperty("--drift",(Math.random()*160-80)+"px");layer.appendChild(piece);}
  }
  function activateBirthday(){
    if(birthdayVisible)return;birthdayVisible=true;$("birthdayOverlay").hidden=false;makeConfetti();
  }
  function deactivateBirthday(){if(!birthdayVisible)return;birthdayVisible=false;$("birthdayOverlay").hidden=true;}
  function init(){
    setPersonalContent();buildPopGrid();updateCountdown();setInterval(updateCountdown,1000);
    $("chooseGameBtn").addEventListener("click",openGameSelect);
    $("musicToggle").addEventListener("click",()=>setMusic(!musicOn));
    $("openLetterBtn").addEventListener("click",()=>showPage("letter"));
    document.querySelectorAll("[data-go]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.go)));
    document.querySelectorAll("[data-game]").forEach(el=>el.addEventListener("click",()=>launchGame(el.dataset.game)));
    document.querySelectorAll("[data-close]").forEach(el=>el.addEventListener("click",()=>closeModal(el.dataset.close)));
    $("startPopBtn").addEventListener("click",startPopGame);$("spinBtn").addEventListener("click",spinSlot);
    $("rewardReturnBtn").addEventListener("click",returnToArcade);
    $("everydaySecretBtn").addEventListener("click",()=>{
      const msg=$("everydaySecret"),open=msg.hidden;msg.hidden=!open;
      $("everydaySecretBtn").setAttribute("aria-expanded",String(open));$("everydaySecretBtn").querySelector("span").textContent=open?"－":"＋";
    });
    $("birthdaySecretBtn").addEventListener("click",()=>{$("birthdaySecret").hidden=!$("birthdaySecret").hidden;});
    $("closeBirthdayBtn").addEventListener("click",()=>{$("birthdayOverlay").hidden=true;});
    document.addEventListener("keydown",e=>{if(e.key==="Escape"){Object.keys(modals).forEach(closeModal);}});
  }
  init();
})();
