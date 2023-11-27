<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="" prop="projectName">
        <el-input v-model="queryParams.projectName" placeholder="请输入书籍名称或作者名字查询" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否可借阅" prop="opTowerNum">
        <el-select style="width: 200px;" size="small" v-model="queryParams.status" filterable reserve-keyword default-first-option>
          <el-option v-for="item in borrowTypeList" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input v-model="queryParams.towerNo" placeholder="请输入" clearable @keyup.enter.native="handleQuery"></el-input> -->
      </el-form-item>
      <el-form-item label="类型" prop="opTowerNum">
        <el-select style="width: 200px;" size="small" v-model="queryParams.opTowerNum" filterable reserve-keyword default-first-option>
          <el-option v-for="item in bookTypeList" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input v-model="queryParams.towerNo" placeholder="请输入" clearable @keyup.enter.native="handleQuery"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini">全选</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini">批量下载</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini">批量借阅</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-upload class="upload-demo" action="http://127.0.0.1:8080/uploadfile" :on-preview="handlePreview" :on-remove="handleRemove" :headers="{'token': token}" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :show-file-list="false">
          <el-button size="small" type="primary">点击上传</el-button>

        </el-upload>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="list" element-loading-text="Loading" border fit highlight-current-row>

      <el-table-column type="selection" width="55"> </el-table-column>

      <el-table-column align="center" label="序号" width="95">

        <template slot-scope="scope">

          {{ scope.$index+1 }}
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
          {{ scope.row.detail }}
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="出版时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />

          <span>{{ scope.row.publishDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="剩余数量" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="190">
        <template slot-scope="scope">
          <el-row style="display: flex;justify-content: center;">
            <el-col>

              <el-button size="mini" @click.stop="" icon="el-icon-edit-outline" @click="downloadFile(scope.row.fileName)">下载</el-button>

            </el-col>
            <el-col>

              <el-button size="mini" v-if="scope.row.count" @click.stop="handleBorrowing(scope.row.id)" type="success" icon="el-icon-edit-outline">借阅</el-button>

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
import { getList, getTypeMap, addBorrowingTicket } from "@/api/table";
import { mapGetters } from "vuex";
import { getToken } from "@/utils/auth";
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
  computed: {
    ...mapGetters(["userId"]),
  },
  data() {
    return {
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      list: null,
      bookTypeList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "电子书",
          value: "1",
        },
        {
          label: "实体书",
          value: "0",
        },
      ],
      borrowTypeList: [
        {
          label: "全部",
          value: null,
        },
        {
          label: "可借阅",
          value: "1",
        },
        {
          label: "不可借阅",
          value: "0",
        },
      ],
      listLoading: true,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        projectName: null,
        projectId: null,
      },
      typeMap: {},
      token: "",
      fileList: [],
    };
  },
  created() {
    this.token = getToken();
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
        pageNo: this.queryParams.pageNo,
        pageSize: this.queryParams.pageSize,
        keyWord: "",
      }).then((response) => {
        this.list = response.data.records;
        this.listLoading = false;
      });
    },
    handleBorrowing(bookId) {
      addBorrowingTicket({ bookId, userId: this.userId }).then((res) => {
        this.$message({
          type: "success",
          message: "借阅成功!",
        });
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    downloadFile(fileName) {
      fetch(
        `http://127.0.0.1:8080/download/${encodeURIComponent(fileName)}`,
        {
          headers: {
            token: `${getToken()}`, // 添加身份验证 token
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.blob();
        })
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = fileName; // 设置文件名
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
        });
    },
  },
};
</script>
