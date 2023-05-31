<script setup>
import { onMounted, reactive, ref,toRaw } from 'vue';
import { getDataItem, setDataItem } from '../util/data'
import { useRouter } from 'vue-router'
const router = useRouter();
const goQuestion = (id) => {
  router.push({
    path: `/question/${id}?data=${new Date().getTime()}`,
  });
}

// setDataItem({
//   id: 1,
//   title: "两数相加",
//   level: "简单",
//   status: "已解决",
//   md: "question1.txt",
//   input: [[1, 2], [3, 4], [6, 7]],
//   result: [3, 7, 13]
// })
let dataItems = ref();
onMounted(()=>{
  dataItems.value = getDataItem()
})
</script>

<template>
  <div class="chooseLee">
    <h1 style="text-align:center;padding-bottom:20px;">请选择题目作答</h1>
    <table>
      <tr>
        <th>题号</th>
        <th>难度</th>
        <th>标题</th>
        <th>状态</th>
      </tr>
      <tr @click="goQuestion(item.id)" v-for="(item, index) in dataItems" :v-key="item.id + index">
        <td>{{ item.id }}</td>
        <td>{{ item.level }}</td>
        <td>{{ item.title }}</td>
        <td :class="[item.status === '已解决' ? 'solved' : 'unresolved']">{{ item.status }}</td>
      </tr>


    </table>
  </div>
</template>


<style scoped lang='scss'>
.chooseLee {
  padding: 20px 100px;
  width: 100%;
  height: 100%;
  min-width: 600px;

  table {
    text-align: center;
    width: 100%;
    height: auto;

    tr:nth-child(odd) {
      background-color: #F2F3F4;
    }

    tr {
      width: 100%;
      height: 30px;
    }

    tr:hover td {
      cursor: pointer;
      background-color: #ccc;
    }
  }

  .solved {
    color: green;
  }

  // .solving{
  //   color: yellow;
  // }
  .unresolved {
    color: red;
  }
}</style>