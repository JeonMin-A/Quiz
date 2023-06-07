<template>
  <div class=""></div>
  <div class=""></div>
  <div class="w-full flex justify-center items-center h-full">
    <div class="flex flex-col">
      <!-- 이미지 영역 -->
      <img :src="require(`@/assets/images/quiz_logo.png`)" alt="퀴즈 로고" class="w-[250px] sm:w-[300px] md:w-[500px] mx-auto xl:w-[600px] xl:-mt-10">
      <h1 class="mx-auto font-black"></h1>
      <div class="w-full bg-white rounded-lg p-5 gap-x-5 flex flex-wrap justify-center">
        <!-- 닉네임 영역 -->
        <input @keyup.enter="NameChk" @input="chk()" v-model="userName" type="text" placeholder="닉네임을 입력해주세요." class="border pl-4 py-2 rounded-md shadow-md outline-none basis-full sm:basis-5/12">
        <!-- btn -->
        <button @click="NameChk()" class="text-sm sm:text-base btn-primary bg-gray-400 text-black border hover:bg-[#303030] hover:animate-none hover:text-white sm:py-0 basis-full sm:basis-3/12 mt-5 sm:mt-0 animate-pulse uppercase">start !</button>
        <div class="mt-4 text-xs sm:text-sm font-bold">
          <p v-if="userName != ''" class="mb-5 mt-5 text-lg text-center">{{ userName }}님 반갑습니다 !</p>
          <p>문제 유형은 {{ SelectRandom === "0" ? "기본" : "랜덤" }}, {{ selectType }} 카테고리를 선택하였으며, 총 {{ dataList.length }} 개의 문제 중 {{ selectCount }} 문제를 선택하셨습니다.
          </p>
        </div>
      </div>
      <!-- <form @submit.prevent> -->
      <div class="w-full bg-white rounded-lg p-5 mt-5 flex justify-between items-center flex-wrap">
        <div class="flex justify-around basis-full items-center xl:basis-4/12">
          <p class="sm:text-sm text-xs btn-primary basis-5/12 text-center bg-gray-300 border-[#7a7a7a44] border-[1px]">랜덤 설정</p>
          <select v-model="SelectRandom" class="border rounded basis-6/12 py-1 text-center">
            <option value="0">기본</option>
            <option value="1">랜덤</option>
          </select>
        </div>
        <div class="flex justify-around basis-full items-center xl:basis-4/12 my-5 xl:my-0">
          <p class="sm:text-sm text-xs btn-primary bg-gray-300 border-[#7a7a7a44] border-[1px] basis-5/12 text-center">문제 유형</p>
          <select @change="selectCount = 2" v-model="selectType" class="border rounded basis-6/12 py-1 text-center">
            <option value="전체">전체 ({{ dataList.length }}문제)</option>
            <option v-for="(e, index) in uniqueTypes" :key="e" :value="e">{{ e }}({{ cateCount[index] }}문제)</option>
          </select>
        </div>
        <div class="flex justify-around basis-full items-center xl:basis-4/12">
          <p class="sm:text-sm text-xs btn-primary bg-gray-300 border-[#7a7a7a44] border-[1px] border-1 basis-5/12 text-center">개수 설정</p>
          <select v-model="selectCount" class="border rounded basis-6/12 py-1 text-center">
            <option v-for="e in cateList.length" :key="e" :value="e">{{ e }}문제</option>

          </select>
        </div>
      </div>
    <!-- </form> -->
      <div class="fixed bg-white left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 z-50 border rounded-lg duration-700 transition-all w-3/4 sm:w-2/4 lg:w-1/6 error opacity-0 invisible">
        <h3 class="bg-gray-100 p-2 pl-4">경고창</h3>
        <p class="p-4 py-6">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
  <p class="text-center text-xs bg-[#f5f6f7]">{{ LastUpdate[0] }}</p>
</template>

<script lang="ts">
import LastUpdate from "../assets/QuizList.json"

import { defineComponent } from 'vue';
import { RouteLocationRaw } from 'vue-router';

interface Quiz {
  id : number,
  question: string,
  answer: string,
  view: {
    number1: string;
    number2: string;
    number3: string;
    number4: string;
  },
  type: string,
  hint: string
}

import QuizList from "../assets/QuizList.json"
export default defineComponent({
  name: 'HomeView',
  data() {
    return {
      errorMsg: "이름을 입력해주세요.",
      userName: "",
      dataList: [] as Quiz[],
      SelectRandom: "0",
      selectType: "전체",
      selectCount: 9,
      LastUpdate: LastUpdate.LastUpdate
    }
  },
  methods: {
    chk(){
      const regex = /^[가-힣]*$/;
      if(!regex.test(this.userName)){
        this.userName = this.userName.replace(/[^가-힣]*/, '');
      }
    },
    // :string | undefined
    NameChk(){
      if(!this.userName){
        const errorEl = document.querySelector(".error");
        errorEl?.classList.remove('invisible', 'opacity-0', 'top-[48%]');
        errorEl?.classList.add('top-1/2', 'opacity-1')
        setTimeout(()=>{
          errorEl?.classList.add('invisible', 'opacity-0', 'top-[48%]')
          errorEl?.classList.remove('top-1/2', 'opacity-1')
        },2500);
      }else{
        const route : RouteLocationRaw = 
        {name: "QuizView", 
        query: {
          userName: this.userName,
          SelectRandom: this.SelectRandom,
          selectType: this.selectType,
          selectCount: this.selectCount
        },
        replace : false} // 이전페이지로 뒤로가기가 필요하다면 false로 설정하면 됨.
      this.$router.push(route)
      }
    }
  },
  components: {

  },
  computed: {
    // 특정 속성을 추출해서 새로운 배열을 만들기 위해 Set 객체를 사용한다. >> 중복된 값을 허용하지 않는 데이터 집합 >> 새오눈 배열로 다시 반환
    // 우리가 원하는 배열에서 중복값을 제거하고 유일한 값을 배열로 생성
    uniqueTypes(): string[]{
      return [...new Set(this.dataList.map((e)=> e.type))]
    },
    cateCount(): number[]{
      return this.uniqueTypes.map((e)=>{
        return this.dataList.filter((item)=>{
          return e === item.type
        }).length
      })
    },
    // 별도로 연습
    cateList() : Quiz[]{
      return this.dataList.filter((e)=>{
        if(this.selectType !== '전체'){
          return e.type === this.selectType
        }else{
          return e.type
        }
      })
    }
  },
  created() {
    this.dataList = QuizList.QuizList as Quiz [];
  },
  mounted() {
    document.querySelector("input")?.focus();
  },
});
</script>
