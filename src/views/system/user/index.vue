<script lang="ts" setup>
import {
  getdept,
  getUsers,
  addUser,
  userById,
  deleteUser,
  downTemp,
  getUserList,
  downloadTemplateApi
} from '@/api/user/index'
import Popconfirm from 'element-plus'
import { listRoleOptions } from '@/api/role/index'
import { deptOptions } from '@/api/dept/index'
import { OptionType, formInline, UserQuery, UserForm } from '@/api/user/types'
import {
  Search,
  Refresh,
  Plus,
  Delete,
  Download,
  Top
} from '@element-plus/icons-vue'
import { onMounted } from 'vue'
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { prependOnceListener } from 'process'

const handleClick = () => {
  console.log('click')
}

const tableData = ref()

const filterText = ref()
const treeRef = ref<InstanceType<typeof ElTree>>()
const treedata = ref<OptionType[]>()
const ruleFormRef = ref(ElForm)
const defaultProps = {
  children: 'children',
  label: 'name',
  value: 'id'
}
const filterNode = (value: string, data: any) => {
  if (!value) return true
  return data.name.includes(value)
}

function handleNodeClick(data) {
  console.log(data.id)
  queryParams.deptId = data.id
  onSearch()
}

const queryParams: UserQuery = reactive({
  pageNum: 1,
  pageSize: 10
})
const pageInfo = reactive({
  pagenum: 1,
  pagesize: 10
})

const total = ref()
const rolesArr = ref()
const deptArr = ref()
const onSubmit = () => {
  console.log('submit!')
}
function resetTable() {
  ruleFormRef.value.resetFields()
  queryParams.pageNum = 1
  onSearch()
}
function onSearch() {
  getUserList(pageInfo).then((res) => {
    console.log(res)
    tableData.value = res.data.list
    total.value = res.data.total
  })
}
// 打开弹框
async function openDialog(id: number) {
  centerDialogVisible.value = true
  await getRoleOptions()
  await getDeptOptions()
  if (id) {
    console.log(id)
    userById(id).then((res) => {
      console.log(res)
      Object.assign(formData, res.data)
    })
  } else {
  }
}
function getDeptlist() {
  getdept().then((res) => {
    treedata.value = res.data
  })
}
// 获取部门下拉列表
function getDeptOptions() {
  deptOptions().then((res) => {
    deptArr.value = res.data
    console.log(deptArr, 90909)
  })
}
// 获取角色下拉列表
function getRoleOptions() {
  listRoleOptions().then((res) => {
    rolesArr.value = res.data
  })
}

function delUser(id) {
  console.log(id)
  deleteUser(id).then((res) => {
    if ((res.code = '00000')) {
      ElMessage.success(res.message)
    }
    onSearch()
  })
}
// 下载模板
function download() {
  downloadTemplateApi()
    .then((response) => {
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
      })
      const a = document.createElement('a')
      const href = window.URL.createObjectURL(blob) // 下载链接
      a.href = href
      a.download = decodeURI(
        response.headers['content-disposition'].split(';')[1].split('=')[1]
      ) // 获取后台设置的文件名称
      document.body.appendChild(a)
      a.click() // 点击下载
      document.body.removeChild(a) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    })
    .catch((err) => {
      console.log(err)
    })
}

function downloadTemplate() {
  downloadTemplateApi()
    .then((res: any) => {
      let blob = new Blob([res.data], {
        type: 'application/vnd.ms-excel'
      })
      // 3.创建一个临时的url指向blob对象
      let objectUrl = window.URL.createObjectURL(blob)
      // 4.创建url之后可以模拟对此文件对象的一系列操作，例如：预览、下载
      let a = document.createElement('a')
      a.setAttribute('href', objectUrl)
      a.setAttribute('download', '用户模板表.xlsx')
      a.click()
      // 5.释放这个临时的对象url
      window.URL.revokeObjectURL(url)
    })
    .catch((err) => {
      console.log(err)
    })
}

function importData() {
  importUser().then((res) => {
    console.log(res)
  })
}
// 新增部门
// function openDialog() {}

/**
 * UserForm，用户表单对象
 */

const formSize = ref('default')
const userFormRef = ref(ElForm)
const formData = reactive<UserForm>({
  status: 1
})

const addrules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  deptId: [{ required: true, message: '请选择部门', trigger: 'blur' }],
  roleIds: [{ required: true, message: '请选择角色', trigger: 'blur' }]
})
const centerDialogVisible = ref(false)
// const submitForm = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('submit!')
//       addUser()
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
function submitForm() {
  console.log(JSON.parse(JSON.stringify(formData)), 181881818)

  userFormRef.value.validate((valid: any) => {
    if (valid) {
      addUser(JSON.parse(JSON.stringify(formData))).then((res) => {
        console.log(res)
        if ((res.code = '00000')) {
          ElMessage.success(res.message)
          centerDialogVisible.value = false
        }
        onSearch()
      })
    } else {
      console.log(444555666)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  centerDialogVisible.value = false

  formEl.resetFields()
}

const options = Array.from({ length: 10000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`
}))

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

let arr = [
  { id: 1, parent_id: 0, name: '有来技术' },
  { id: 2, parent_id: 1, name: '研发部门' },
  { id: 3, parent_id: 1, name: '测试部门' },
  { id: 4, parent_id: 2, name: '2测试部门' }
]

onMounted(() => {
  onSearch()
  getDeptlist()
})
</script>
<template>
  <div class="main">
    <el-row :gutter="30">
      <el-col :xs="24" :lg="4" class="mb-[12px]">
        <el-card class="box-card">
          <div class="card-header">
            <el-input
              style="margin-bottom: 10px"
              :prefix-icon="Search"
              v-model="filterText"
              placeholder="部门名称"
              clearable
            />
          </div>
          <el-tree
            ref="treeRef"
            class="filter-tree"
            :data="treedata"
            :props="defaultProps"
            default-expand-all
            @node-click="handleNodeClick"
            :filter-node-method="filterNode"
          />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="20">
        <el-card style="margin-bottom: 10px">
          <el-form
            ref="ruleFormRef"
            :inline="true"
            :model="queryParams"
            class="demo-form-inline"
          >
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
              >
                <el-option label="启用" :value="1" />
                <el-option label="禁用" :value="0" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button :icon="Search" type="primary" @click="onSearch()"
                >搜索</el-button
              >
              <el-button :icon="Refresh" @click="resetTable">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <div style="display: flex; justify-content: space-between">
                <div>
                  <el-button :icon="Plus" type="success" @click="openDialog()"
                    >新增</el-button
                  >
                  <el-button :icon="Delete" type="danger" @click="onSubmit"
                    >删除</el-button
                  >
                </div>
                <div>
                  <el-dropdown split-button @click="onSubmit">
                    导入
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="downloadTemplate"
                          ><el-icon><Download /></el-icon
                          >下载模板</el-dropdown-item
                        >
                        <el-dropdown-item @click="importData"
                          ><el-icon><Top /></el-icon>导入数据</el-dropdown-item
                        >
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                  <el-button
                    style="margin: 0 10px"
                    :icon="Download"
                    @click="onSubmit"
                    >导出</el-button
                  >
                </div>
              </div>
            </div>
          </template>
          <div>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column type="selection" width="55" />
              <el-table-column prop="id" label="编号" width="150" />
              <el-table-column prop="username" label="用户名" width="120" />
              <el-table-column prop="nickname" label="用户昵称" width="120" />
              <el-table-column prop="genderLabel" label="性别" width="120" />
              <el-table-column prop="deptName" label="部门" width="200" />
              <el-table-column prop="mobile" label="手机号码" width="120" />
              <el-table-column prop="status" label="状态" width="120">
                <template #default="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="1"
                    inactive-value="0"
                    class="ml-2"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="创建时间" width="120" />
              <el-table-column fixed="right" label="操作" width="200">
                <template #default="scope">
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="handleClick"
                    >重置密码</el-button
                  >
                  <el-button
                    link
                    type="primary"
                    size="small"
                    @click="openDialog(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    link
                    type="primary"
                    size="small"
                    slot="reference"
                    @click="delUser(scope.row.id)"
                    >删除</el-button
                  >
                  <!-- <el-popconfirm
                    title="确认删除用户?"
                    confirm-button-text="确认"
                    cancel-button-text="取消"
                    @onConfirm="delUser(scope.row.id)"
                  >
                    <template #reference>
                      <el-button
                        link
                        type="primary"
                        size="small"
                        slot="reference"
                        @click="delUser(scope.row.id)"
                        >删除</el-button
                      >
                    </template>
                  </el-popconfirm> -->
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              layout="total, prev, pager, next"
              :page-sizes="[100, 200, 300, 400]"
              :total="total"
            />
          </div>
        </el-card>
        <el-dialog
          v-model="centerDialogVisible"
          title="新增用户"
          width="50%"
          align-center
        >
          <el-form
            ref="userFormRef"
            :model="formData"
            :rules="addrules"
            label-width="120px"
            class="demo-ruleForm"
            :size="formSize"
            status-icon
          >
            <el-form-item label="用户名" prop="username" required>
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名称"
              />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
              <el-input
                v-model="formData.nickname"
                placeholder="请输入用户昵称"
              />
            </el-form-item>
            <el-form-item label="所属部门" prop="deptId">
              <el-tree-select
                v-model="formData.deptId"
                placeholder="请输入所属部门"
                :data="deptArr"
                :props="defaultProps"
                check-strictly
                :render-after-expand="false"
              />
            </el-form-item>

            <el-form-item label="性别" prop="gender">
              <el-select v-model="formData.gender" placeholder="请输入性别">
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="formData.roleIds"
                placeholder="请输入用户角色"
                multiple
                style="width: 240px"
              >
                <el-option
                  v-for="item in rolesArr"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="formData.mobile" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="formData.email" placeholder="请输入用户邮箱" />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="resetForm(userFormRef)">取消</el-button>
              <el-button type="primary" @click="submitForm(userFormRef)">
                确定
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.main {
  // display: flex;
  margin: 20px;
}
.demo-form-inline .el-input {
  --el-input-width: 220px;
}
</style>
