<template>
	<div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"  @submit.native.prevent>
      <el-form-item label="" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入书籍名称或作者名字查询" clearable ></el-input>
      </el-form-item>
  

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" >搜索</el-button>
        <el-button icon="el-icon-refresh" >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">


      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini"  >批量注销</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch" ></right-toolbar>
    </el-row>

		<!-- 表格 -->
		<el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>

			<el-table-column type="selection" width="55"> </el-table-column>

			<el-table-column align="center" label="序号" width="95">

				<template slot-scope="scope">

					{{ scope.$index }}
				</template>
			</el-table-column>
			<el-table-column label="用户名">
				<template slot-scope="scope">
					{{ scope.row.title }}
				</template>
			</el-table-column>
			<el-table-column label="用户类型" width="110" align="center">
				<template slot-scope="scope">
					<span>{{ scope.row.author }}</span>
				</template>
			</el-table-column>
			<el-table-column label="手机号" width="110" align="center">
				<template slot-scope="scope">
					{{ scope.row.pageviews }}
				</template>
			</el-table-column>
			<el-table-column class-name="status-col" label="邮箱地址" width="110" align="center">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status | statusFilter">

						{{ scope.row.status }}</el-tag>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="created_at" label="注册日期" width="200">
				<template slot-scope="scope">
					<i class="el-icon-time" />

					<span>{{ scope.row.display_time }}</span>
				</template>
			</el-table-column>

			
			<el-table-column label="操作" align="center" fixed="right" width="190">
				<template slot-scope="scope">
					<el-row style="display: flex;justify-content: center;">

						<el-col >

							<el-button size="mini" @click.stop="handleBorrowing(scope.$index, scope.row)" type="success"
								icon="el-icon-edit-outline">注销</el-button>

						</el-col>

					</el-row>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize" @pagination="getList" />
   
	</div>
</template>

<script>
import { getList } from "@/api/table";

export default {
	filters: {
		statusFilter(status) {
			const statusMap = {
				published: "success",
				draft: "gray",
				deleted: "danger",
			};
			return statusMap[status];
		},
	},
	data() {
		return {
			    // 显示搜索条件
				showSearch: true,
			    // 总条数
				total: 15,
				list: null,
				bookTypeList: [{
					label: '全部',
					value: null
				}, {
					label: '电子书',
					value: '1'
				}, {
					label: '实体书',
					value: '0'
				
				}],
				borrowTypeList: [{
					label: '全部',
					value: null
				}, {
					label: '可借阅',
					value: '1'
				}, {
					label: '不可借阅',
					value: '0'
				
				}],
				listLoading: true,
			      // 查询参数
				  queryParams: {
					pageNo: 1,
					pageSize: 10,
					projectName: null,
					projectId: null,
					engineerId:null
				},
				// 表单参数
				form: {
					projectName: null,
					projectId: null,
				},
		};
	},
	created() {
		this.fetchData();
	},
	methods: {
		fetchData() {
			this.listLoading = true;
			getList().then((response) => {
				this.list = response.data.items;
				this.listLoading = false;
			});
		},
	},
};
</script>
