function showTab(id){
 document.getElementById("input").style.display = id=="input"?"block":"none";
 document.getElementById("view").style.display = id=="view"?"block":"none";
 document.getElementById("courtContainer").style.display="none";
 document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
 event.target.classList.add("active");
 render();
}

function addStat(num, stat){
 if(stat.includes("Make") || stat.includes("Miss")){
   pendingShot={num,stat,x:25,y:42}; openCourt();
 } else {
   game[num].stats[stat]=(game[num].stats[stat]||0)+1; render();
 }
}

function render(){
 const input=document.getElementById("input");
 const view=document.getElementById("view");
 input.innerHTML="<h2>Tap Stats</h2>"; view.innerHTML="<h2>Live Totals</h2>";
 let totals={};

 players.forEach(p=>{
   const player=game[p.num];
   let div=document.createElement("div"); div.className="player";
   div.innerHTML=`<b>#${p.num} ${player.name}</b><br>`;
   stats.forEach(stat=>{
     let btn=document.createElement("button"); btn.textContent=stat;
     btn.onclick=()=>addStat(p.num,stat); div.appendChild(btn);
   });
   input.appendChild(div);

   let line=""; Object.entries(player.stats).forEach(([k,v])=>{ line+=`${k}: ${v} `; totals[k]=(totals[k]||0)+v; });
   view.innerHTML+=`<div><b>#${p.num} ${player.name}</b> → ${line||"No stats"}</div>`;

   if(player.shots.length>0){
     let c=document.createElement("canvas"); c.className="shotChart";
     c.width=150; c.height=84/50*150; let ctxc=c.getContext("2d");
     ctxc.fillStyle="#d2691e"; ctxc.fillRect(0,0,c.width,c.height);
     ctxc.fillStyle="lime";
     player.shots.forEach(s=>{ ctxc.beginPath(); ctxc.arc(s.x/50*c.width,s.y/84*c.height,4,0,2*Math.PI); ctxc.fill(); });
     view.appendChild(c);
   }
 });
 view.innerHTML+="<h3>Team Totals</h3>"; Object.entries(totals).forEach(([k,v])=>view.innerHTML+=`${k}: ${v}<br>`);
}

render();