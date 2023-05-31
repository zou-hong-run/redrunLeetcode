let data = [];
export const setDataItem = (newItemObj)=>{
    let oldData = getDataItem();
    if(oldData){
        oldData.push(newItemObj);
        data = oldData;
    }else{
        data.push(newItemObj)
    }
    // console.log(oldData,"====",data);
    window.localStorage.setItem("questionItems",JSON.stringify(data))
}
export const getDataItem = ()=>{
    let result = window.localStorage.getItem("questionItems");
    // console.log("result",JSON.parse(result));
    if(result){
        return JSON.parse(result);
    }else{
        return null
    }
}

// export default {
//     data:[
//         {
//             id:1,
//             title:"回文字符串",
//             level:"简单",
//             status:"未解答",
//             md:"question1.txt",
//             input:[121,-121,10,20,101],
//             result:[true,false,false,false,true]
//         },
//         {
//             id:1,
//             title:"两数相加",
//             level:"简单",
//             status:"已解答",
//             md:"question2.txt",
//             input:[[1,2],[3,4],[6,7]],
//             result:[3,7,13]
//         },
//     ]
// }