<!-- vue-3-ts -->
<template>
    <div class="w-full flex items-center justify-center flex-wrap h-full ">
        <div class="mx-auto w-7/12 lg:w-9/12 items-center flex-wrap">
            <div class="h-5 mt-6 bg-gray-300 basis-full relative rounded-lg">
                <p v-if="current != Number(selectCount)" class="absolute right-2 -top-5 text-[10px] lg:-top-7 lg:text-sm">{{ current+1 }} / {{ selectCount }}</p>
                <p v-else class="absolute right-2 -top-5 text-xs">종료</p>
                <p class="absolute right-2 top-0.5 text-[10px] lg:text-sm lg:-top-0.5">{{ progress + "%" }}</p>
                <div class="h-5 rounded-lg bg-slate-400 transition-all duration-500" :style="{width:progress + '%'}"></div>
            </div>
            <h3 class="basis-full text-center text-sm lg:text-2xl sm:text-xl mt-5 sm:mt-10 bg-white rounded-lg p-2">{{ userName }}님 <span class="text-black">반갑습니다.</span></h3>
            <!-- 만약에 현재 풀이가 되고 있다면 현재문제/ 최대 문제로 표현되고 ㅡ게 아니라면 종료가 되었기 때문에 다른 메세지를 보여준다. -->
            <!-- 문제 영역 -->
            <div class="bg-white rounded-lg my-5 sm:my-10 p-5 basis-full text-[5px]" v-if="current < Number(selectCount)"><span class="text-gray-500 lg:text-base block lg:mb-5">{{ current+1 }}번 문제</span><p class="text-[10px] sm:text-xl">{{ selectQuestion[current].question }}</p>
                <ul class="flex mt-5 flex-wrap justify-between">
                    <li @click="current ++; SelectValue(e); hintUse = false;" v-for="(e, index) in randomView[current]" :key="index" class="cursor-pointer font-bold basis-full bg-gray-100 lg:basis-[44%] lg:py-4 lg:text-center xl:basis-[44.8%] xl:py-6 xl:text-center rounded-lg mb-5 border hover:border-slate-400 transition-all duration-200 hover:bg-slate-500 hover:text-white text-xs p-2 lg:text-base">
                        <span>{{ index + 1 }}번 : </span>
                        <span class="break-all text-center basis-10/12 ">{{ e[1] }}</span>
                    </li>
                </ul>
                <div class="flex justify-between items-center flex-wrap">
                    <!-- 힌트 -->
                    <button @click="useHint();" class="btn-primary basis-[43%] sm:basis-[21%] xl:basis-2/12 text-[10px] bg-gray-300 lg:text-sm">힌트 : {{ hint }}개</button>
                    <p v-if="hintUse" class="text-lg">{{ dataList.QuizList[current].hint }}</p>
                    <!-- 힌트 사용시 텍스트 -->
                    <p v-else-if="hint < 1 ">힌트를 모두 사용하셨습니다.</p>
                    <router-link to="/" class="btn-primary basis-[39.333333%] sm:basis-[21%]  xl:basis-2/12 text-center text-[10px] bg-gray-300 lg:text-sm">처음으로</router-link>
                </div>
            </div>
            <div v-else class="flex flex-col">
                <span class="text-center mt-10 mb-10 lg:text-4xl">{{ resultScore }}개 맞음 / {{ Math.floor((resultScore / Number(selectCount)) * 100) }}점
                </span>
                <router-link to="/" class="btn-primary basis-[39.333333%] sm:basis-[21%]  xl:basis-2/12 text-center text-[10px] bg-gray-300 animate-pulse hover:bg-[#303030] hover:text-white lg:text-lg lg:leading-10 hover:animate-none">처음으로</router-link>
            </div>
            <img :src="require(`@/assets/images/doge.png`)" alt="도지" class="absolute bottom-0 right-0 w-20">
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import JSConfetti from 'js-confetti'


import QuizList from "../assets/QuizList.json"
interface QuizType{
    id: number,
    question: string,
    answer: string,
    view:{
        number1:string;
        number2:string;
        number3:string;
        number4:string;
    },
    type: string
}

export default defineComponent({
    name: "QuizView",
    data() {
        return {
            // isShow: false, // 내가 쓴 변수
            dataList: QuizList,
            current: 0,
            hint: 3,
            hintUse: false,
            userSelect: [] as string[],
            SelectRandom: this.$route.query.SelectRandom,
            selectType: this.$route.query.selectType,
            selectCount: this.$route.query.selectCount,
            MaxCount: 0,
            userName: this.$route.query.userName //$route앞에 무조건 this.를 붙여야 됨.
            // Type Assertion - 변수명 as 변경할 타입 - vue 값 as 변경할 타입

            /*
            as 키워드는 유니온 타입 같은 복잡한 타입을 하나의 정확한 타입으로 줄일 때 사용 단, 하나의 타입일 떄 사용시 에러 발생
            as 타입은 타입실드 임시해제용
            1. 왜 타입 에러가 나는지 모를 깨 임시로 해결 하기 위해 사용하거나
            2. 내가 어떤 타입의 데이터가 들어올지 확실히 알고 있을 때 에러를 방지하기 위해 사용
            */
        }
    },
    methods: {
        SelectValue(e: unknown) {
            this.userSelect.push((e as string)[1]);
            console.log(this.userSelect)
            
            console.log(Math.floor((this.resultScore / Number(this.selectCount)) * 100))
            if(Math.floor((this.resultScore / Number(this.selectCount)) * 100) === 100 ){
                const jsConfetti = new JSConfetti()
                jsConfetti.addConfetti()
            }

        },
        // ShowHint(){
        //     if(this.isShow === true){
        //         this.isShow = false
        //     }else{
        //         this.isShow = true
        //     }
        // },
        useHint() :void{
            if(this.hintUse){return}
            if(this.hint < 1){return}
            this.hint--;
            // this.hintUse === false? this.hintUse = true : this.hintUse = false;
            // if(!this)
            this.hintUse ||= true; // 평가 논리 계산법 - 값이 false일 때 true로만 변경 가능 이외에 값은 변경 되지 않음. 만약 여러가지 조건문이 필요하다면 if문이 필요
        },
        questionCount(){
            this.MaxCount = this.dataList.QuizList.filter((e)=>{
                if(this.selectType !== '전체'){
                    return e.type === this.selectType
                }else{
                    return e.type
                }
            }).length
        },
    },
    computed: {
        progress(): number {
            return Math.floor((this.current / Number(this.selectCount)) * 100);
        },
        // score(){
        //     return Math.floor((this.answer / Number(this.selectCount))*100);
        // },
        resultScore(): number{
            return this.selectQuestion.filter((e, index)=>{
                return e.answer === this.userSelect[index]
            }).length
            
        },
        randomView() :Array<Array<[string,unknown]>>{
            return this.selectQuestion.map((e,index)=>{
                return Object.entries(this.selectQuestion[index].view).sort(()=> Math.random() - 0.5) // 랜덤값을 설정하면 뒤에 소수점이 붙여줘서 날려주는거임
            })
        },
        selectQuestion(): QuizType[] {
            return this.dataList.QuizList.filter((e)=>{
                if(this.selectType !== '전체'){
                    return e.type === this.selectType
                }else{
                    return e.type
                }
            })
        }
    },
    created() {
        if(Number(this.SelectRandom) > 1 || typeof this.SelectRandom !== 'number'){
            this.SelectRandom = "1";
        }

        // if(this.SelectRandom == "1"){
        //     this.dataList.QuizList.sort(()=> Math.random() - 0.5)
        // }
        // this.questionCount()

        if(this.SelectRandom == "1"){
            this.dataList.QuizList.sort(()=> Math.random() - 0.5)
        }
        this.questionCount()

        if(Number(this.selectCount) > this.MaxCount){
            this.selectCount = this.MaxCount.toString();
        }

      

    },
})
</script>


<style scoped>

</style>