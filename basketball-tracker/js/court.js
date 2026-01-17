let canvas, ctx;
let pendingShot=null, dragging=false;

function courtToCanvasX(x){ return x/50*canvas.width; }
function courtToCanvasY(y){ return y/84*canvas.height; }
function canvasToCourtX(px){ return px/canvas.width*50; }
function canvasToCourtY(py){ return py/canvas.height*84; }

function openCourt(){
 const container=document.getElementById("courtContainer");
  container.style.display="flex";

   canvas=document.getElementById("courtCanvas");

    const screenW=window.innerWidth*0.95;
     const screenH=window.innerHeight*0.95;
      if(screenW/50*84>screenH){
         canvas.height=screenH;
            canvas.width=screenH/84*50;
             } else {
                canvas.width=screenW;
                   canvas.height=screenW/50*84;
                    }

                     ctx=canvas.getContext("2d");
                      drawCourt();

                       canvas.onmousedown=startDrag;
                        canvas.onmousemove=drag;
                         canvas.onmouseup=endDrag;
                          canvas.ontouchstart=startDrag;
                           canvas.ontouchmove=drag;
                            canvas.ontouchend=endDrag;

                             document.getElementById("confirmBtn").onclick=confirmShot;
                             }

                             function drawCourt(){
                              const w=canvas.width,h=canvas.height;
                               ctx.fillStyle="#d2691e"; ctx.fillRect(0,0,w,h);
                                ctx.strokeStyle="#fff"; ctx.lineWidth=3;

                                 // Half-court
                                  ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke();

                                   // Keys & Free throws
                                    [[0,0],[84,0]].forEach(yOffset=>{
                                       const keyW = 16, keyH = 19;
                                          const x = courtToCanvasX((50-keyW)/2);
                                             const y = courtToCanvasY(yOffset>0?84-keyH:yOffset);
                                                ctx.strokeRect(x, y, courtToCanvasX(keyW), courtToCanvasY(keyH));
                                                   ctx.beginPath();
                                                      ctx.arc(w/2, y + courtToCanvasY(keyH), courtToCanvasX(keyW/2),0,Math.PI,false);
                                                         if(yOffset>0) ctx.arc(w/2, y + courtToCanvasY(0), courtToCanvasX(keyW/2), Math.PI,2*Math.PI,false);
                                                            ctx.stroke();
                                                             });

                                                              // 3PT arcs
                                                               [[0,0],[84,0]].forEach(yOffset=>{
                                                                  const y = courtToCanvasY(yOffset>0?84:0);
                                                                     ctx.beginPath();
                                                                        ctx.arc(w/2, y>h/2?y:h-y, courtToCanvasX(19.75),0,Math.PI,false);
                                                                           ctx.stroke();
                                                                            });

                                                                             // Shots
                                                                              players.forEach(p=>{
                                                                                 p.shots.forEach(s=>{
                                                                                      ctx.fillStyle=s.stat.includes("Make")?"lime":"red";
                                                                                           ctx.beginPath();
                                                                                                ctx.arc(courtToCanvasX(s.x),courtToCanvasY(s.y),12,0,2*Math.PI);
                                                                                                     ctx.fill();
                                                                                                        });
                                                                                                         });

                                                                                                          // Pending shot
                                                                                                           if(pendingShot){
                                                                                                              ctx.fillStyle=pendingShot.stat.includes("Make")?"lime":"red";
                                                                                                                 ctx.beginPath();
                                                                                                                    ctx.arc(courtToCanvasX(pendingShot.x),courtToCanvasY(pendingShot.y),12,0,2*Math.PI);
                                                                                                                       ctx.fill();
                                                                                                                        }
                                                                                                                        }

                                                                                                                        // Drag/Drop
                                                                                                                        function startDrag(e){
                                                                                                                         e.preventDefault(); dragging=true;
                                                                                                                          const pos=getPointerPos(e);
                                                                                                                           pendingShot.x=canvasToCourtX(pos.x);
                                                                                                                            pendingShot.y=canvasToCourtY(pos.y);
                                                                                                                             drawCourt();
                                                                                                                             }
                                                                                                                             function drag(e){ if(!dragging) return; e.preventDefault();
                                                                                                                              const pos=getPointerPos(e); pendingShot.x=canvasToCourtX(pos.x); pendingShot.y=canvasToCourtY(pos.y); drawCourt();
                                                                                                                              }
                                                                                                                              function endDrag(e){ dragging=false; }
                                                                                                                              function getPointerPos(e){ return e.touches?{x:e.touches[0].clientX,y:e.touches[0].clientY}:{x:e.clientX,y:e.clientY}; }
                                                                                                                              function confirmShot(){
                                                                                                                               if(!pendingShot) return;
                                                                                                                                const g=game[pendingShot.num];
                                                                                                                                 g.shots.push({stat:pendingShot.stat,x:pendingShot.x,y:pendingShot.y});
                                                                                                                                  g.stats[pendingShot.stat]=(g.stats[pendingShot.stat]||0)+1;
                                                                                                                                   pendingShot=null;
                                                                                                                                    document.getElementById("courtContainer").style.display="none";
                                                                                                                                     render();
                                                                                                                                     }