<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" @submit.native.prevent>
      <el-form-item label="" prop="keyWord">
        <el-input v-model="queryParams.keyWord" placeholder="请输入书籍名称或作者名字查询" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否可借阅" prop="opTowerNum">
        <el-select style="width: 200px;" size="small" v-model="queryParams.count" filterable reserve-keyword default-first-option>
          <el-option v-for="item in borrowTypeList" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input v-model="queryParams.towerNo" placeholder="请输入" clearable @keyup.enter.native="handleQuery"></el-input> -->
      </el-form-item>
      <el-form-item label="类型" prop="opTowerNum">
        <el-select style="width: 200px;" size="small" v-model="queryParams.type" filterable reserve-keyword default-first-option>
          <el-option v-for="item in bookTypeList" :key="item.id" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <!-- <el-input v-model="queryParams.towerNo" placeholder="请输入" clearable @keyup.enter.native="handleQuery"></el-input> -->
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8" style="margin-bottom: 10px;">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" v-if="this.$store.getters.user.userType==1" @click="addBook">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-download" size="mini" @click="handleBatchDownload">批量下载</el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-notebook-2" size="mini" @click="addBatchBorrowingTickets">批量借阅</el-button>
      </el-col>

      <right-toolbar :showSearch.sync="showSearch"></right-toolbar>
    </el-row>

    <!-- 表格 -->
    <el-table v-loading="listLoading" ref="table" :data="list" element-loading-text="Loading" border fit highlight-current-row>

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
      <el-table-column label="剩余数量（实体书籍）" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.count }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属类型" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ categoryTypeMap[scope.row.categoryId] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类别" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ typeMap[scope.row.type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="190">
        <template slot-scope="scope">
          <el-row style="display: flex;justify-content: center;">
            <el-col>

              <el-button size="mini" v-if="scope.row.type>0" @click.stop=""  @click="downloadFile(scope.row.fileName)">下载</el-button>

            </el-col>
            <el-col>

              <el-button size="mini" v-if="scope.row.count&&scope.row.type!=1" @click.stop="handleBorrowing(scope.row.id)" type="success" >借阅</el-button>

            </el-col>

          </el-row>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="fetchData" />
    <!-- 弹窗 -->

    <el-dialog title="添加图书" :visible.sync="open" append-to-body>
      <el-form ref="form" :model="form" :rules="formRules" label-width="100px" label-position="left" class="two-items-per-row">
        <div class="form-row">
          <el-form-item label="书名:" prop="name">
            <el-input v-model="form.name" size="small"></el-input>
          </el-form-item>
          <el-form-item label="ISBN:" prop="isbn">
            <el-input v-model="form.isbn" size="small" autocomplete="new-password"></el-input>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="作者:" prop="author">
            <el-input v-model="form.author" size="small" autocomplete="new-password"></el-input>
          </el-form-item>

          <el-form-item label="图书类型:" prop="type">

            <el-select v-model="form.type" size="small" style="width: 100%;">
              <el-option v-for="item in bookTypeList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>

          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="书籍类型:" prop="categoryId">

            <el-select v-model="form.categoryId" size="small" style="width: 100%;">
              <el-option v-for="item in categoryTypeMapArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出版日期:" prop="publishDate">
            <el-input v-model="form.publishDate" size="small" type="date"></el-input>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="出版商:" prop="publisher">
            <el-input v-model="form.publisher" size="small" type="tel"></el-input>
          </el-form-item>

          <el-form-item label="书籍数量:" prop="count">
            <el-input v-model.number="form.count" size="small" min="0"  type="number"></el-input>
          </el-form-item>
        </div>
        <div class="form-row">
          <el-form-item label="简介:" prop="detail" style="flex: 1;">
            <el-input v-model="form.detail" size="small" type="textarea" :rows="2" autocomplete="new-password"></el-input>
          </el-form-item>
        </div>

        <el-upload class="upload-demo" style="width: 100%;" v-if="form.type" action="http://127.0.0.1:8080/uploadfile" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :headers="{'token': token}" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">

          <el-button size="small" type="primary">点击上传</el-button>

        </el-upload>

        <div class="dialog-footer" style="text-align: end;width: 100%;">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  getList,
  getTypeMap,
  addBorrowingTicket,
  addBatchBorrowingTickets,
  addBook
} from "@/api/table";
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
    ...mapGetters(["user"]),
  },
  data() {
    return {
      formRules:{
        name: [{ required: true, message: "请输入书名", trigger: "blur" }],
        isbn: [{ required: true, message: "请输入ISBN", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        type: [
          { required: true, message: "请选择图书类型", trigger: "change" },
        ],
        categoryId: [
          { required: true, message: "请选择书籍类型", trigger: "change" },
        ],
        publishDate: [
          { required: true, message: "请选择出版日期", trigger: "change" },
        ],
        publisher: [
          { required: true, message: "请输入出版商", trigger: "blur" },
        ],
        count: [
          { required: true, message: "请输入书籍数量", trigger: "blur" },
          { type: "number", message: "请输入数字", trigger: "blur" },
        ],
        detail: [{ required: true, message: "请输入简介", trigger: "blur" }],
      },

      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      open: false,
      list: null,
      bookTypeList: [
        {
          label: "电子书/实体书",
          value: 2,
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
          value: -1,
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
        pageNum: 1,
        pageSize: 10,
        keyWord: "",
        count: -1,
        type: null,
      },
      // 表单参数
      form: {
        name: null,
        isbn: null,
        author: null,
        type: null,
        categoryId: null,
        publishDate: null,
        publisher: null,
        count: null,
        detail: null,
        fileName: null,
        url: null,
      },
      categoryTypeMap: {},

      typeMap: {
        0: "实体书",
        1: "电子书",
        2: "电子书/实体书",
      },
      token: "",
      fileList: [],
    };
  },
  created() {
    this.token = getToken();
    this.initTypeMap();
    this.fetchData();
  },
  computed: {
    categoryTypeMapArr() {
      return Object.keys(this.categoryTypeMap).map((key) => {
        return {
          label: this.categoryTypeMap[key],
          value: key,
        };
      });
    },
  },
  methods: {
    addBook() {
      this.reset();
      this.open = true;
    },
    addBatchBorrowingTickets() {
      const selections = this.$refs.table.selection;
      if (!selections || selections.length === 0) {
        this.$message.error("请选择要借阅的实体图书");
        return;
      }
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].type == 1) {
          this.$message.error("电子书不需要借阅");
          return;
        } else if (selections[i].count == 0) {
          this.$message.error("该书已经借完");
          return;
        }
      }
      const ids = selections.map((item) => {
        return { bookId: item.id, userId: this.user.id };
      });

      addBatchBorrowingTickets(ids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量借阅成功!",
          });
          this.fetchData();
        })
        .catch((error) => {
          console.error("批量借阅失败:", error);
          this.$message.error("批量借阅失败，请重试");
        });
    },
    handleBatchDownload() {
      debugger;
      const selections = this.$refs.table.selection;
      if (!selections || selections.length === 0) {
        this.$message.error("请选择要下载的文件");
        return;
      }
      for (let i = 0; i < selections.length; i++) {
        if (selections[i].type == 0) {
          this.$message.error("包含不可下载的实体书");
          return;
        }
      }

      // 创建一个 Promise 队列以顺序执行下载操作
      const downloadQueue = [];
      for (let i = 0; i < selections.length; i++) {
        downloadQueue.push(this.downloadFile(selections[i].fileName));
      }

      // 顺序执行 Promise 队列中的下载操作
      Promise.all(downloadQueue)
        .then(() => {
          this.$message.success("批量下载完成");
        })
        .catch((error) => {
          console.error("批量下载失败:", error);
          this.$message.error("批量下载失败，请重试");
        });
    },

    initTypeMap() {
      getTypeMap().then((res) => {
        this.categoryTypeMap = res.data;
      });
    },
    fetchData() {
      this.listLoading = true;
      getList({
        pageNum: this.queryParams.pageNum,
        pageSize: this.queryParams.pageSize,
        keyWord: this.queryParams.keyWord,
        count: this.queryParams.count,
        type: this.queryParams.type,
      }).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    handleBorrowing(bookId) {
      addBorrowingTicket({ bookId, userId: this.user.id }).then((res) => {
        this.$message({
          type: "success",
          message: "借阅成功!",
        });
        this.fetchData();
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;

      this.fetchData();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.keyWord = "";
      this.queryParams.count = -1;
      this.queryParams.type = "";
      this.handleQuery();
    },
    handleRemove(file, fileList) {
      this.form.fileName = null;
      this.form.url = null;
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
    handleSuccess(response, file, fileList) {
      this.form.fileName = file.name;
      this.form.url = response.data;
    },
    /** 表单重置 */
    reset() {
      this.form = {
        name: null,
        isbn: null,
        author: null,
        type: null,
        categoryId: null,
        publishDate: null,
        publisher: null,
        count: null,
        detail: null,
        fileName: null,
        url: null,
      };
    },
    downloadFile(fileName) {
      return new Promise((resolve, reject) => {
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
            resolve(); // 下载完成后 resolve
          })
          .catch((error) => {
            console.error(
              "There has been a problem with your fetch operation:",
              error
            );
            reject(error); // 下载出错时 reject
          });
      });
    },
    /** 取消按钮 */
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm() {
      debugger;
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        }
        if(this.form.type){
          if(this.form.fileName&&this.form.url){
                // 添加的提交
                addBook(this.form).then((response) => {
                  if(response.code==200){
                    this.$message({
                          message: "操作成功",
                          type: "success",
                    });
                    this.open = false;
                    this.fetchData();
                  }else{
                    this.$message({
                          message: response.msg,
                          type: "error",
                    });
                  }

    
                }).catch((error) => {
                  console.error(error);
                  this.$message({
                          message:"操作失败",
                          type: "error",
                    });
                });
            // 添加的提交
            // this.$confirm("确认添加图书吗？", "提示", {
            //   confirmButtonText: "确定",
            //   cancelButtonText: "取消",
            //   type: "warning",
            // })
            //   .then(() => {
            //     this.$message({
            //       message: "操作成功",
            //       type: "success",
            //     });
            //     this.open = false;
            //     this.fetchData();
            //   })
            //   .catch(() => {
            //     this.$message({
            //       type: "info",
            //       message: "已取消添加",
            //     });
            //   });

          }else{
            this.$message({
                message: "请先上传文件",
                type: "error",
            });
            return
          }
        }

        //   // 添加的提交
        //   addUser(this.form).then((response) => {
        //     this.$message({
        // message: "操作成功",
        // type: "success",
        // });
        //     this.open = false;
        //     this.fetchData();
        //   });
      });
    },
  },
};
</script>
<style>
.two-items-per-row {
  display: flex;
  flex-wrap: wrap;
}

.form-row {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.form-row > .el-form-item {
  width: calc(50% - 10px); /* 设置 item 宽度为一行的一半，减去间距 */
  margin-right: 10px; /* 设置 item 间距 */
}
</style>