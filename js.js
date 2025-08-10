let select = 0;
let handler;
function remove_anim_wrapper(ele,time,top_flip,bottom_flip)
{
    return function remove_anim()
    {
        ele.children[1].innerHTML = time;
        ele.children[2].innerHTML = time;
        top_flip.classList.remove("flip-top-anim");
        bottom_flip.classList.remove("flip-bottom-anim");
        console.log("finish");
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
function startTimer(min,sec)
{
    let minupdate;
    let timer = setInterval(()=>
    {
        sec--;
        if(sec == -1)
        {
            min--;
            sec = 59;
            [sec,min] = padSecMin(sec,min);
            update(document.querySelector(".min2"),min.slice(1,min.length),1);
            update(document.querySelector(".min1"),min.slice(0,-1),0);
        }
        if(min == -1)
        {
            clearInterval(timer);
        }
        [sec,min] = padSecMin(sec,min);
        update(document.querySelector(".sec2"),sec.slice(1,sec.length),3);
        update(document.querySelector(".sec1"),sec.slice(0,-1),2);
        console.log(sec.slice(0,-1),sec.slice(1,sec.length));
    },1000);
}
for(let i = 0;i<3;i++)
{
    document.querySelector(".upper-opt").children[i].addEventListener("click",()=>
    {
        // let ele = document.querySelector('.lower-opt').children[i].innerHTML;
        select = i;
    });
}
document.querySelector(".start").addEventListener("click",()=>
{
    if(select == 0)
    {
        startTimer(30,0);
    }
    else if(select == 1)
    {
        startTimer(5,0);
    }
    else
    {
        startTimer(10,0);
    }
});
