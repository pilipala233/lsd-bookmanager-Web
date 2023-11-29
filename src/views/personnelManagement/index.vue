<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="请输入用户名" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini" @click="addUser">添加用户</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini" @click="batchDeleteUsers">批量注销</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="listLoading"  ref="table"  :data="list" element-loading-text="Loading" border fit highlight-current-row>

      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column align="center" label="序号" width="95">

        <template slot-scope="scope">

          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{ scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="用户类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.userType] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="邮箱地址" width="110" align="center">
        <template slot-scope="scope">

          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册日期" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />

          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="190">
        <template slot-scope="scope">
          <el-row style="display: flex;justify-content: center;">

            <el-col>

              <el-button size="mini" @click.stop="deleteUser(scope.row.id)" type="success" icon="el-icon-edit-outline">注销</el-button>

            </el-col>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="fetchData" />
    <!-- 弹窗 -->
    <el-dialog title="添加用户" :visible.sync="open" width="700px" v-dialogDrag append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-form-item label="用户名:" prop="userName">
          <el-input v-model="form.userName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickName">
          <el-input v-model="form.nickName" size="small" autocomplete="new-password" ></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="form.password" size="small" type="password"  autocomplete="new-password" ></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email" size="small" type="email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phoneNumber">
          <el-input v-model="form.phoneNumber" size="small" type="tel"></el-input>
        </el-form-item>
		<div style="display: flex; justify-content: space-between">
			<el-form-item label="性别:" prop="sex">
			<el-select v-model="form.sex" size="small">
                <el-option
                  v-for="item in optionList.sex"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                >
				</el-option>
			</el-select>
			</el-form-item>
			<el-form-item label="用户类型:" prop="userType">
				<el-select v-model="form.userType" size="small">
	                <el-option
						v-for="item in optionList.type"
						:key="item.id"
						:label="item.label"
						:value="item.value"
						>
					</el-option>
				</el-select>
			</el-form-item>
		</div>


        <!-- 其他表单项，您可以继续添加 -->

        <div class="dialog-footer" style="text-align: end">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getList, getTypeMap, addUser,deleteUser,deleteUsers } from "@/api/personnelManagement";

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
      typeMap: {},
      // 显示搜索条件
      showSearch: true,
      open: false,
      // 总条数
      total: 0,
      list: null,
      listLoading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
		    keyWord:''

      },
      // 表单参数
      form: {
        userName: undefined,
        nickName: undefined,
        password: undefined,
        email: undefined,
        phoneNumber: undefined,
        sex: undefined,
        userType: undefined,
      },
      // 表单校验
      rules: {
        towerNumber: [
          { required: true, message: "杆塔编号名称不能为空", trigger: "blur" },
        ],
      },
      // 下拉框数据
      optionList: {
        
        type: [
          { label: "超管", value: "1" },
          { label: "高级用户", value: "2" },
          { label: "普通用户", value: "3" },
        ],
        sex: [
          { label: "男", value: "1" },
          { label: "女", value: "0" },
        ],
      },

    };
  },
  created() {
    this.initTypeMap();
    this.fetchData();
  },
  methods: {
    initTypeMap() {
      getTypeMap().then((res) => {
        this.typeMap = res.data;
      });
    },
    fetchData() {
      this.listLoading = true;
      getList({
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        keyWord: this.queryParams.keyWord,
      }).then((response) => {
        this.list = response.data.records;
		this.total = response.data.total;
        this.listLoading = false;
      });
    },
    addUser() {
		this.reset();
      	this.open = true;
    //   addUser(this.form).then((res) => {
    //     this.$message({
    //       message: "操作成功",
    //       type: "success",
    //     });
    //   });
    },
	/** 取消按钮 */
	cancel() {
      this.open = false;
      this.reset();
      //this.$refs.selectPersonVue.cleanTableSelect();
    },
	/** 提交按钮 */
	submitForm() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }

        // 添加的提交
        addUser(this.form).then((response) => {
          this.$message({
			message: "操作成功",
			type: "success",
		  });
          this.open = false;
          this.fetchData();
        });
      });

      //this.$refs.selectPersonVue.cleanTableSelect();
    },
	deleteUser(id){
		deleteUser({id}).then((res) => {
			this.$message({
				message: "操作成功",
				type: "success",
			});
		  });
		  this.fetchData();
	},
    /** 表单重置 */
    reset() {
      this.form = {
        userName: undefined,
        nickName: undefined,
        password: undefined,
        email: undefined,
        phoneNumber: undefined,
        sex: undefined,
        userType: undefined,
 
      };
      //this.resetForm("form");
    },
	    // 批量删除用户
	batchDeleteUsers() {
      const selections = this.$refs.table.selection;
      if (!selections || selections.length === 0) {
        this.$message.error('请选择要删除的用户');
        return;
      }

      const ids = selections.map(item => item.id);
	   // 假设 ID 存储在 'id' 字段中，请根据实际情况调整
      deleteUsers({ids})
        .then(() => {
          this.$message.success('批量删除成功');
          this.fetchData(); // 刷新数据
        })
        .catch(error => {
          console.error('批量删除失败:', error);
          this.$message.error('批量删除失败，请重试');
        });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
	  
      this.fetchData();
    },
    /** 重置按钮操作 */
    resetQuery() {
		this.queryParams.keyWord ='';
      //this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>
