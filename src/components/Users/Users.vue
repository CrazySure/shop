<template>
    <div class="users">
        <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsersList">

                        <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="17">
                    <el-button type="primary" @click="addDialogShow">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <el-table :data="userList" style="width: 100%" stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot:default="slotProps">
                        <el-switch v-model="slotProps.row.mg_state" @change="changeState(slotProps.row)"></el-switch>

                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180">
                    <template v-slot:default="slotProps">
                        <el-button type="primary" size="mini" icon="el-icon-edit"
                            @click="editDialogShow(slotProps.row.id)"></el-button>
                        <el-button type="danger" size="mini" icon="el-icon-delete" @click="delDialog(slotProps.row.id)">
                        </el-button>
                        <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
                            <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>

            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加用户弹窗 -->
        <el-dialog title="添加用户" :visible.sync="addDialog" width="50%" @close="addFormReset">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialog = false">取 消</el-button>
                <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑对话框 -->
        <el-dialog title="编辑" :visible.sync="editDialog" width="50%" @close="editFormReset">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialog = false">取 消</el-button>
                <el-button type="primary" @click="editUsers">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            // 验证邮箱
            var checkEmail = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

                if (regEmail.test(value)) {
                    return callback();
                }
                return callback(new Error('请输入合法的邮箱'));
            }
            var checkMobile = (rule, value, callback) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
                if (regMobile.test(value)) {
                    // 合法的手机号
                    return callback();
                }
                // 不合法的话
                return callback(new Error('请输入合法的手机号'))
            }
            return {
                //用户列表
                userList: [],
                //获取列表需要传入的参数
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 4
                },
                total: 0,
                // 添加用户弹窗
                addDialog: false,
                // 添加用户验证
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: '',

                },
                addFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入手机', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }

                    ],
                },
                // 编辑对话框
                editDialog: false,
                editForm: {},
                editFormRules: {
                    email: [
                        { required: true, message: '请输入合法邮箱', trigger: 'blur' },
                        { validator: checkEmail, trigger: 'blur' }
                    ],
                    mobile: [
                        { required: true, message: '请输入合法手机', trigger: 'blur' },
                        { validator: checkMobile, trigger: 'blur' }

                    ],
                }

            }
        },
        created() {
            //用户列表信息
            this.getUsersList();
        },
        methods: {
            getUsersList() {
                this.$axios.get(`users`, {
                    params: this.queryInfo
                })
                    .then(res => {
                        window.console.log(res);
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('获取权限列表失败')
                        }
                        this.$message.success('获取列表成功');
                        this.total = res.data.data.total;
                        this.userList = res.data.data.users;
                    })
            },
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.getUsersList();
            },
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getUsersList();


            },
            // 改变状态
            changeState(info) {
                this.$axios.put(`users/${info.id}/state/${info.mg_state}`)
                    .then(res => {
                        window.console.log(res)
                        if (res.data.meta.status !== 200) {
                            return this.$message.error('修改状态失败')
                        }
                        this.$message.success('修改状态成功')
                    })
            },
            // 添加用户
            addDialogShow() {
                this.addDialog = true;
            },
            // 取消按钮重置验证信息
            addFormReset() {
                this.$refs.addFormRef.resetFields();
            },
            // 添加用户 确定按钮
            addUsers() {
                this.$refs.addFormRef.validate(valid => {
                    if (!valid) return;
                    this.$axios.post('users', this.addForm)
                        .then(res => {
                            // window.console.log(res);
                            if (res.data.meta.status !== 201) {
                                return this.$message.error('添加用户失败');
                            }
                            this.$message.success('添加用户成功');
                            this.addDialog = false;
                            this.getUsersList();
                        })


                })
            },
            // 点击编辑按钮
            editDialogShow(id) {


                this.$axios.get('users/' + id)
                    .then(res => {
                        window.console.log(res)
                        if (res.data.meta.status !== 200) return
                        this.editForm = res.data.data;
                    })
                this.editDialog = true;

            },
            // 取消按钮重置表单
            editFormReset() {
                this.$refs.editFormRef.resetFields();
            },
            // 确定按钮
            editUsers() {
                this.$refs.editFormRef.validate(valid => {
                    if (!valid) return
                    this.$axios.put('users/' + this.editForm.id, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile,
                    })
                        .then(res => {
                            if (res.data.meta.status !== 200) return this.$message.error('更新用户失败')
                            this.editDialog = false;
                            this.getUsersList();
                            this.$message.success('更新用户信息成功')


                        })
                });

            },
            // 删除按钮
            delDialog(id) {
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$axios.delete('users/' + id)
                            .then(res => {
                                if (res.data.meta.status !== 200) return
                                this.getUsersList();

                                this.$message.success('删除成功')
                            })

                    })
                    .catch(() => {
                        this.$message.error('已经取消删除')
                    })

            }
        }

    }
</script>
<style lang="less" scoped>

</style>