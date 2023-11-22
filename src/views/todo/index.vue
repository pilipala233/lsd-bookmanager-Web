<template>
  <div >
    <div class="dashboard-container">
      <div  v-for="o in mergedResults" :key="o.id" >
        <el-card :body-style="{ padding: '0px' }" style="position: relative;height: 300px;">
			<div slot="header" class="clearfix">
				<span>{{typeMap[o.type]}}</span>
				<i class="el-icon-close" style="float:right;cursor: pointer;" @click="deleteItem(o.id)"></i>
				<!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
			</div>
			<div style="padding: 10px;letter-spacing: 3px;">

					{{ o.content }}
			</div>
			<div style="padding: 14px;    position: absolute;bottom: 0;right: 0;">
				<div class="clearfix">
					
					<el-button  v-if="o.type==2" class="button">续借</el-button>
					<el-button  v-if="o.type==2" class="button">归还</el-button>
					<el-button  v-if="o.type==3" class="button">同意</el-button>
					<el-button  v-if="o.type==3" class="button">驳回</el-button>
				</div>
			</div>
        </el-card>
	</div>
</div>
  </div>
</template>
  
  <script>
import { mapGetters } from "vuex";
import { returnBook,continueBook,updateTicketStatus,updateBorrowingTicketIsNotice,selectBorrowingTicketByReturnDate,selectBorrowingTicketByIsNotice } from "@/api/todo";

export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data(){
	return{
		title: '图书归还通知',
		currentDate: new Date(),
		typeMap:{
			1:'图书借阅成功通知',
			2:'借阅逾期通知',
			3:'借书申请通知',
			

		},
		mergedResults:[],
		data:[
			{
				type:1,
				content:'您申请借阅的《交互设计4》已通过借阅审批。请在三个月内归还图书。如需续借，请在还书日期前点击续借。',
				id:1,

			},{
				type:2,
				content:'您还有部分书籍未归还，请尽快归还，谢谢合作。',
				id:2,

			},
			{
				type:3,
				content:'书籍名称：交互设计4图书编号：jhsj42022100601借书人：赵宝刚申请日期：2022/09/30还书日期：2022/12/30',
				id:3,

			},
		],
		queryParams: {
			pageNo: 1,
			pageSize: 100,

		},
	}

  },
created(){
	Promise.all([
				selectBorrowingTicketByIsNotice(this.queryParams),
				selectBorrowingTicketByReturnDate(this.queryParams)	
			
			]).then(([isNoticeResult, returnDateResult]) => {
				const isNoticeData = isNoticeResult.data.records.map(record => ({
					...record,
					type: 1 ,
					content:`您申请借阅的《${record.bookName}》已通过借阅审批。请在三个月内归还图书。如需续借，请在还书日期前点击续借。`
				}));

				const returnDateData = returnDateResult.data.records.map(record => ({
					...record,
					type: 2 ,
					content:`您申请借阅的《${record.bookName}》已逾期，请尽快归还，谢谢合作。`,
				}));
				this.mergedResults = isNoticeData.concat(returnDateData);

				console.log(mergedResults);
			}).catch(error => {
				console.error('Error fetching data:', error);
				// 处理请求错误
			});

},
methods:{
		deleteItem(id){
			
			this.data = this.data.filter(obj=>obj.id!=id)
		}
	}
};
</script>
  
  <style lang="scss" scoped>
  .dashboard-container{
	display: grid;
	grid-template-columns: repeat(4, 1fr); /* 创建四列，每列平均占据可用空间的1/4 */
	gap: 10px; /* 项目之间的间隔 */
  }
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
	color: #fff;
	margin-right: 10px;
    background-color: #755aa6;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

</style>
  