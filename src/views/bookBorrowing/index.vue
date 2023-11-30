<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="请输入书籍名称或作者名字查询" clearable></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-notebook-2" size="mini" @click="batchReturnBooks">批量归还</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="listLoading"  ref="table" :data="list" element-loading-text="Loading" border fit highlight-current-row>

      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column align="center" label="序号" width="95">

        <template slot-scope="scope">

          {{ scope.$index +1}}
        </template>
      </el-table-column>
      <el-table-column label="书名">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="作者" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简介" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.detail}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="所属类别" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.type }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="借书时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />

          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="还书时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />

          <span>{{ scope.row.planReturnDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="190">
        <template slot-scope="scope">
          <el-row style="display: flex;justify-content: center;">
            <el-col>

              <el-button size="mini" @click.stop="returnBook(scope.row.id)" >还书</el-button>

            </el-col>
            <el-col>

              <el-button size="mini" @click.stop="continueBook(scope.row.id)" type="success" >续借</el-button>

            </el-col>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0"  :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="fetchData" />

  </div>
</template>

<script>
import { getList, returnBook, continueBook,returnBooks } from "@/api/bookBorrowing";

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
      total: 0,
      list: null,

      listLoading: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWord: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
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
    returnBook(id) {
      returnBook({ id }).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.fetchData();
      });
    },
    // 批量还书
    batchReturnBooks() {
      const selections = this.$refs.table.selection;
      if (!selections || selections.length === 0) {
        this.$message.error("请选择要归还的图书");
        return;
      }

      const ids = selections.map((item) => item.id);
      // 假设 ID 存储在 'id' 字段中，请根据实际情况调整
      returnBooks({ ids })
        .then(() => {
          this.$message.success("批量归还成功");
          this.fetchData(); // 刷新数据
        })
        .catch((error) => {
          console.error("批量归还失败:", error);
          this.$message.error("批量归还失败，请重试");
        });
    },
    continueBook(id) {
      continueBook({ id }).then((res) => {
        this.$message({
          message: "操作成功",
          type: "success",
        });
        this.fetchData();
      });
    },
    handleQuery() {
      this.queryParams.pageNum = 1;

      this.fetchData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.keyWord = "";
      //this.resetForm("queryForm");
      this.handleQuery();
    },
  },
};
</script>
