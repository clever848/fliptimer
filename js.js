let select = 0;
let handler;
let timerRunning = 0;
let popSelect = -1;
let Focus = 25;
let Break = 3;
let longBreak = 15; 
let cus = 0;
const layout = document.querySelector(".layout");
function remove_anim_wrapper(ele,time,top_flip,bottom_flip)
{
    return function remove_anim()
    {
        ele.children[1].innerHTML = time;
        ele.children[2].innerHTML = time;
        top_flip.classList.remove("flip-top-anim");
        bottom_flip.classList.remove("flip-bottom-anim");
        bottom_flip.removeEventListener("animationend",handler);
    }
}
function update(ele,time,i)
{
    ele.children[0].innerHTML = time;
    ele.children[3].innerHTML = time;
    let top_flip = document.querySelectorAll(".top-flip")[i];
    let bottom_flip = document.querySelectorAll(".bottom-flip")[i];
    top_flip.classList.add("flip-top-anim");
    bottom_flip.classList.add("flip-bottom-anim");
    handler = remove_anim_wrapper(ele,time,top_flip,bottom_flip);
    bottom_flip.addEventListener("animationend",handler,{once:true});

}
function padSecMin(sec,min)
{
    sec = String(sec);
    sec = sec.padStart(2,'0');
    min = String(min);
    min = min.padStart(2,'0');
    return [sec,min];
}
function iniUpdate(timeEle,val)
{
    document.querySelector(`.${timeEle} .bottom`).innerHTML = val;
    document.querySelector(`.${timeEle} .top-flip`).innerHTML = val;
}
function resetCongra()
{
    let ele = document.querySelector(".congratulation");
    ele.children[1].innerHTML = "Focus";
    ele.children[2].innerHTML = "Break";
    ele.children[3].innerHTML = "Long break";
}
function restart()
{
    resetCongra();
    if(timerRunning == 0)
    {
        console.log(`select ${select}`);
        if(select == 0)
        {
            clock.startTimer(Focus,0);
        }
        else if(select == 1)
        {
            clock.startTimer(Break,0);
        }
        else
        {
            clock.startTimer(longBreak,0);
        }
    }
}
function pop(timer,subTime)
{
    let audio1 = new Audio("beep1.mp3");
    audio1.play();
    clearInterval(timer);
    timerRunning = 0;
    popSelect = -1;
    document.querySelector(".congratulation").classList.add("scale2");
    layout.classList.add("scale1");
    let target1;
    let target2;
    if(select == 0)
    {
        target1 = document.querySelector(".congratulation").children[2];
        target2 = "Break";
    }
    else
    {
        target1 = document.querySelector(".congratulation").children[1];
        target2 = "Focus";
    }
    let subTimeHolder = setInterval(() => 
    {
        subTime--;
        target1.innerHTML = "";
        target1.innerHTML+=`${target2}(${subTime})`; 
        if(popSelect > -1)
        {
            select = popSelect;
            layout.classList.remove("scale1");
            document.querySelector(".congratulation").classList.remove("scale2");
            audio1.pause();
            restart();
            clearInterval(subTimeHolder);
        }
        else
        {
            if(subTime == 0)
            {
                audio1.pause();
                clearInterval(subTimeHolder);
                layout.classList.remove("scale1");
                document.querySelector(".congratulation").classList.remove("scale2");
                target1.innerHTML = target2;
                if(target1 == document.querySelector(".congratulation").children[2])
                {
                    select = 1;
                }
                else
                {
                    select = 0;
                }
                restart();
            }
        }
    }, 1000);
}
function iniFullUb()
{
    iniUpdate("sec1",0);
    iniUpdate("sec2",0);
    iniUpdate("min1",0);
    iniUpdate("min2",0);
}
const clock = (function ()
{
    let timer;
    let csec;
    let cmin;
    function startTimer(min,sec)
    {
        timerRunning = 1;
        document.querySelector(".war").innerHTML = "";
        let audio = new Audio("tick.mp3");
        let minupdate1 = Math.floor(min/10);
        let minupdate2 = min%10;
        iniUpdate("min1",minupdate1);
        iniUpdate("min2",minupdate2);
        document.querySelector(".selected").classList.remove("selected");
        document.querySelector(".upper-opt").children[select].classList.add("selected");
        timer = setInterval(()=>
        {
            sec--;
            if(document.querySelector(".option").children[1].classList.contains("fa-volume-high"))
            {
                audio.play();
            }
            if(sec == -1)
            {
                min--;
                if(min == -1)
                {
                    pop(timer,5);
                }
                sec = 59;
                [sec,min] = padSecMin(sec,min);
            }
            if(minupdate1 != min.slice(0,-1))
            {
                update(document.querySelector(".min1"),min.slice(0,-1),0);
                minupdate1 = min.slice(0,-1);
            }
            if(minupdate2 != min.slice(1,min.length))
            {
                update(document.querySelector(".min2"),min.slice(1,min.length),1);
                minupdate2 = min.slice(1,min.length);
            }
            
            [sec,min] = padSecMin(sec,min);
            update(document.querySelector(".sec2"),sec.slice(1,sec.length),3);
            if(sec.slice(1,sec.length) == 9)
            {
                update(document.querySelector(".sec1"),sec.slice(0,-1),2);
            }
            csec = sec;
            cmin = min;
        },1000);
    }
    function pauseTimer()
    {
        clearInterval(timer);
        timerRunning = 0;
    }
    function cleartimer()
    {
        pauseTimer();
        setTimeout(() => {
            iniFullUb();
        }, 700);
        timerRunning = 0;
    }
    function resumeTimer()
    {
        startTimer(cmin,csec);
        timerRunning = 1;
    }
    return {startTimer,cleartimer,resumeTimer,pauseTimer};
})();
function upperOpt(i)
{
    document.querySelector(".selected").classList.remove("selected");
    if(select != i && timerRunning == 1)
    {
        layout.classList.add("scale1");
        document.querySelector(".cancel").classList.add("scale2");
        clock.pauseTimer();
    }
    else
    {
        prev = document.querySelector(".upper-opt").children[i];
        select = i;
    }
    document.querySelector(".upper-opt").children[select].classList.add("selected");
}
let prev;
for(let i = 0;i<3;i++)
{
    document.querySelector(".upper-opt").children[i].addEventListener("click",()=>
    {
        prev = i;
        upperOpt(i);
    });
    document.querySelector(".lower-opt").children[i].addEventListener("click",()=>
    {
        if(i == 0)
        {
            restart();
        }
        else if(i==1)
        {
            if(timerRunning == 0)
            {
                document.querySelector(".war").innerHTML = "*timer already reset";
            }
            else
            {
                document.querySelector(".war").innerHTML = "";
                clock.cleartimer();
            }
        }
        else
        {
            document.querySelector(".option").classList.add("scale2");
            if(timerRunning == 1)
            {
                console.log("yes or no");
                layout.classList.add("scale1");
                document.querySelector(".cancel").classList.add("scale2");
                clock.pauseTimer();
                cus = 1;
            }
            else
            {
                document.querySelector(".war").innerHTML = "";
            }
        }
    });
}
for(let i=1;i<4;i++)
{
    document.querySelector(".congratulation").children[i].addEventListener("click",()=>
    {
        if(i == 1)
        {
            popSelect = 0;
        }
        else if(i == 2)
        {
            popSelect = 1;
        }
        else if(i == 3)
        {
            popSelect = 2;
        }
    });
}
for(let i =0;i<2;i++)
{
    document.querySelectorAll(".fa-solid")[i].addEventListener("click",()=>
    {
        layout.classList.remove("scale1");
        document.querySelector(".cancel").classList.remove("scale2");
        if(i == 0)
        {
            clock.cleartimer();
            if(cus == 0)
            {
                upperOpt(prev);
            }
            else
            {
                cus = 0;
                upperOpt(select);
            }
            
        }
        else if(i == 1)
        {
            clock.resumeTimer();
            document.querySelector(".option").classList.remove("scale2"); 
        }
    });
    document.querySelector(".option").children[i].addEventListener("click",()=>
    {
        if(i==0)
        {
            document.querySelector(".option").classList.remove("scale2");
            Focus = document.getElementById("focus-op").value;
            Break = document.getElementById("break-op").value;
            longBreak = document.getElementById("long-break-op").value;
            console.log(Focus,Break,longBreak);
        }
        else if(i==1)
        {
            if(document.querySelector(".option").children[1].classList.contains("fa-volume-high"))
            {
                document.querySelector(".option").children[1].classList.replace("fa-volume-high","fa-volume-xmark");
            }
            else
            {
                document.querySelector(".option").children[1].classList.replace("fa-volume-xmark","fa-volume-high");
            }
        }
    });
}


