<template>
  <div>
    <el-card style="margin: 20px">
      <span style="font-weight: 600">关键字 </span><el-input placeholder="角色名称" style="width: 20%" class="w-50 m-2"></el-input>
      <el-button type="primary" :icon="Search"> 搜索 </el-button>
      <el-button :icon="Refresh"> 重置 </el-button>
    </el-card>

    <el-card style="margin: 20px" class="box-card">
      <template #header>
        <div class="card-header">
          <div>
            <el-button :icon="Plus" type="success" @click="dialogFormVisible = true">新增</el-button>
            <el-button :icon="Delete" type="danger" :disabled="disabled" @click="deleteRoles">删除</el-button>
          </div>
        </div>
      </template>
      <!-- <el-popconfirm title="Are you sure to delete this?">
        <template #reference>
          <el-button>Delete</el-button>
        </template>
      </el-popconfirm> -->
      <el-table ref="multipleTableRef" :data="tableData" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column label="角色名称" width="180">
          <template #default="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column property="code" label="角色编码" width="200" />
        <el-table-column property="status" label="状态" width="150">
          <template #default="scope">
            <el-tag v-if="scope.row.status === 1" class="ml-2" type="success">正常</el-tag>

            <el-tag v-else class="ml-2" type="warning">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="sort" label="排序" width="120" />
        <el-table-column label="操作">
          <template #default>
            <el-button link type="primary" :icon="Position" size="small"> 分配权限</el-button>
            <el-button link type="primary" :icon="Edit" size="small">编辑</el-button>
            <el-button link type="primary" :icon="Delete" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[100, 200, 300, 400]"
        :background="background"
        layout="sizes, prev, pager, next"
        :total="1000"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <!-- 新增 -->
      <el-dialog v-model="dialogFormVisible" title="新增角色" @close="cancelAdd">
        <el-form :model="roleForm" ref="roleFormRef" :rules="rules">
          <el-form-item label="角色名称" prop="name" :label-width="formLabelWidth">
            <el-input v-model="roleForm.name" placeholder="请输入角色名称" autocomplete="off" />
          </el-form-item>
          <el-form-item label="角色编码" prop="code" :label-width="formLabelWidth">
            <el-input v-model="roleForm.code" placeholder="请输入角色编码" autocomplete="off" />
          </el-form-item>
          <el-form-item label="数据权限" prop="dataScope" :label-width="formLabelWidth">
            <el-select v-model="roleForm.dataScope" placeholder="请选择">
              <el-option label="全部数据" :value="0" />
              <el-option label="部门及子部门数据" :value="1" />
              <el-option label="本部门数据" :value="2" />
              <el-option label="本人数据" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
            <el-radio-group v-model="roleForm.status" class="ml-4">
              <el-radio :label="1" size="large">正常</el-radio>
              <el-radio :label="2" size="large">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序" prop="sort" :label-width="formLabelWidth">
            <el-input-number v-model="roleForm.sort" :min="1" :max="10" controls-position="right" @change="handleChange" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="addRole()"> 确定 </el-button>
            <el-button @click="cancelAdd">取消</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { listRoleOptions, getRoleData, addRoles, delRoles } from '@/api/role/index'
import { Search, Refresh, Plus, Delete, Position, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElTable } from 'element-plus'

interface User {
  date: string
  name: string
  address: string
}

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<User[]>([])
const ids = ref([])
const handleSelectionChange = (val: User[]) => {
  ids.value = []
  multipleSelection.value = val
  console.log(val)
  console.log(JSON.parse(JSON.stringify(val)))
  JSON.parse(JSON.stringify(val)).forEach((item) => {
    ids.value.push(item.id)
  })
  console.log(JSON.stringify(ids.value), 11111)
  if (val.length > 0) {
    disabled.value = false
  } else {
    disabled.value = true
  }
}

let tableData = ref([])
const dialogFormVisible = ref(false)
const disabled = ref(true)
const formLabelWidth = '100px'
const roleForm = reactive({
  id: 0,
  name: '',
  code: '',
  sort: 1,
  status: 1,
  dataScope: null
})

const rules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
  code: [
    {
      required: true,
      message: '请输入角色编码',
      trigger: 'blur'
    }
  ],
  dataScope: [
    {
      required: true,
      message: '请选择数据权限',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }
  ]
})

const handleChange = (value: number) => {
  console.log(value)
}
const roleFormRef = ref()

function deleteRoles() {
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delRoles(ids).then((res) => {
      console.log(res)
    })
  })
}

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
const currentPage = ref()
const pageSize = ref()
function addRole() {
  roleFormRef.value.validate()
  addRoles(roleForm).then((res) => {
    console.log(res)
  })
}
function cancelAdd() {
  dialogFormVisible.value = false
  roleFormRef.value.resetFields()
}

function listRole() {
  listRoleOptions().then((res) => {
    console.log(res, '000000')
  })
}
function getRole() {
  getRoleData().then((res) => {
    console.log(res)
    tableData.value = res.data.list
    console.log(tableData, 'tableData')
  })
}
onMounted(() => {
  // listRole()
  getRole()
})
</script>

<style scoped></style>
