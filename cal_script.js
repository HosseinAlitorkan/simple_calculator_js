const main=document.getElementsByTagName("main")[0];
var flag=0
var cal_cal=document.getElementById("cal-button")
var cal_history=document.getElementById("cal-history")
const calculator_elem=`<div>
            <h2>Enjoy your Calculator</h2>
            <table border="2" class="main-table">
                <thead>
                    <th colspan="4">Calculator</th>
                </thead>
            
                <tr>
                    <th colspan="4" id="result">result</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>2</td>
                    <td>3</td>
                    <td>+</td>
                </tr>
                <tr>
                    <td>4</td>
                    <td>5</td>
                    <td>6</td>
                    <td>-</td>
                </tr>
                <tr>
                    <td>7</td>
                    <td>8</td>
                    <td>9</td>
                    <td>*</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>/</td>
                    <th id="op">=</th>
                    <th id="reset">reset</th>
                </tr>
            </table>
        </div>`
const history=`<div>
            <h2>History of your Calculator</h2>
            <ol>
            </ol>
        <button class="history-button" type="button">Clear History</button>
        </div>` 
var first_cal=0,first_his=0        
var calstack=[]
var history_stack=[]
if(localStorage.getItem('history_store')!=null)
{
    history_stack=JSON.parse(localStorage.getItem('history_store'))
}

 console.log("history_stack:",history_stack);
//-------------------------------------------------------//////////
cal_cal.addEventListener("click",()=>{
    flag=0;
    console.log("log:showing calculator");
    main.innerHTML=calculator_elem;
    // if(!first_cal)
    // {
    //     cal_handler();
    //     first_cal=1
    // }
    cal_handler();
})
cal_history.addEventListener("click",()=>{
    flag=1;
    console.log("show history");
    console.log(history_stack);
    main.innerHTML=history
         let ol=main.getElementsByTagName("ol")[0]
        history_stack.forEach((item)=>{ 
            ol.innerHTML=ol.innerHTML+`<li>${item}</li>`
        })
        console.log(main.innerHTML);
    // if(!first_his)
    // {
    //     his_handler();
    //     first_his=1
    // }
    document.getElementsByClassName("history-button")[0].addEventListener("click",his_handler)

})
//---------------------------------------------------------//////////////////////

function cal_handler(){
    //numbers and operators event
    const buttons=document.getElementsByTagName("td")
    for(let i=0;i<buttons.length;i++)
    {
        buttons[i].addEventListener("click",(event)=>{
            if(!calstack.length || !Number.isFinite(+event.target.textContent) || !Number.isFinite(+calstack[calstack.length-1])){
                calstack.push(event.target.textContent)
            }
            else {
                let temp=calstack.pop();
                calstack.push(temp+event.target.textContent)
            }
            let calstack_str=calstack.join('');
            document.getElementById("result").textContent = calstack_str; 
        })
    }
    //rerset and = operator event
    let result;
    const op_=document.getElementById("op")
    op_.addEventListener("click",(event)=>{
         result=calculate(calstack);
        document.getElementById("result").textContent = result; 
    })
    const reset=document.getElementById("reset")
    reset.addEventListener("click",(event)=>{
        let full_ex=calstack.join("")+'='+result;
        history_stack.push(full_ex);
        localStorage.setItem('history_store',JSON.stringify(history_stack))
        calstack=[];
        document.getElementById("result").textContent = "result"; 
    })
}

function his_handler(event){
    history_stack=[];
    localStorage.clear();
    let ol=main.getElementsByTagName("ol")[0]
    ol.innerHTML="Empety"
}
function piorty(ope1,ope2){
    let pio={'+':2, '-':2,'*':1,"/":1};
    if(pio[ope1]>=pio[ope2])
    { 
        return 1;
    }
    return 0;    
}
function main_cal(ope1,op,ope2)
{
    if(op=='+'){
        return (+ope1)+(+ope2);
    }
    else if(op=='-'){
        return (+ope1)-(+ope2);
    }
    else if(op=='*'){
        return (+ope1)*(+ope2);
    }
    else if(op=='/'){
        return (+ope1)/(+ope2);
    }
    return undefined;
}

function calculate(calstack){
    let last_result;
    let operator=[],operand=[];
    //console.log(calstack);
    for(let i=0;i<calstack.length;i++)
    {
       // console.log(operand,operator,calstack[i]);
        if(Number.isFinite(+calstack[i]))
        {
            operand.push(calstack[i]);
            //console.log("if1 -----------------");
        }
        else{
            //console.log(piorty(calstack[i],operator[operator.length-1]))
            //console.log(calstack[i],operator[operator.length-1]);
            if(operator.length==0)
            {
                 operator.push(calstack[i]);
                 //console.log("if21 -----------------");
            }
            else if(piorty(calstack[i],operator[operator.length-1])==1)
            {
                //console.log("if22 -----------------");
                while(piorty(calstack[i],operator[operator.length-1])==1)
                {
                    let temp2=operand.pop();
                    let temp1=operand.pop();
                    let temp3=main_cal(temp1,operator.pop(),temp2);
                    operand.push(temp3);
                    
                }
                operator.push(calstack[i]);
                
                
            }
            else{
                 operator.push(calstack[i]);
                 
                 //console.log("if23 -----------------");
            }
        }
    }
    if(operator.length!=0)
    {
        //console.log("hello");
        while(operator.length!=0)
        {
             let temp2=operand.pop();
            let temp1=operand.pop();
            let temp3=main_cal(temp1,operator.pop(),temp2);
            operand.push(temp3);
        }
       
    }
    //console.log(operand,operator);
    return operand.pop();

}

cal_handler()//for the first time