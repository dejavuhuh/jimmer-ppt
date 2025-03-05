---
theme: ./
colorSchema: 'dark'
layout: intro
# https://sli.dev/custom/highlighters.html
highlighter: shiki
title: Slidev Penguin Theme
themeConfig:
  eventLogo: 'https://raw.githubusercontent.com/babyfish-ct/jimmer-doc/main/logo.png'
  eventUrl: 'https://jimmer.deno.dev/'
---

# Jimmer

针对 Java 和 Kotlin 的革命性 ORM 框架

---
layout: center
title: 大纲
---

1. <Link>ORM 概述</Link>
2. <Link>核心功能</Link>
3. <Link>业务案例</Link>
4. <Link>其他内容</Link>

<style>
li {
  font-size: 24px
}
</style>

---
layout: center
---

# ORM 概述

---
layout: cover
---

# ORM (对象关系映射)

是一种在编程语言**对象**和数据库**模型**之间建立**映射关系**的技术

---
layout: statement
---

# 一对多关联

客户（Customer）与订单（Order）

<div class="grid grid-cols-2 gap-8" v-click="1">
<div class="flex-1 flex flex-col">

```java {hide|all|3-4,11-12}
// MyBatis-Plus
public class Customer {
    @TableId
    private Long id;
}

public class Order {
    @TableId
    private Long id;

    // 客户ID
    private Long customerId;
}
```
<span class="text-gray-300 text-xs" v-click="2">实体之间通过<strong>ID</strong>进行关联</span>

</div>
<div class="flex-1 flex flex-col">

```java {hide|all|3,10,17-19|7-9,13,20}{at:'3'}
// JPA
@Entity
public class Customer {
    @Id
    private Long id;

    // 客户拥有的订单
    @OneToMany
    private List<Order> orders;
}

@Entity
public class Order {
    @Id
    private Long id;

    // 订单归属的客户
    @ManyToOne
    private Customer customer;
}
```
<span class="text-gray-300 text-xs" v-click="4">实体之间通过<strong>对象引用</strong>进行关联</span>

</div>
</div>

---
layout: statement
---

# 多对多关联

用户（User）与角色（Role）

<div class="grid grid-cols-2 gap-8" v-click="1">
<div class="flex-1 flex flex-col">

```java {hide|all|4-5,17|10-11,19}
// MyBatis-Plus
@Data
public class User {
    @TableId
    private Long id;
}

@Data
public class Role {
    @TableId
    private Long id;
}

// 用户-角色关联表
@Data
public class UserRole {
    private Long userId;

    private Long roleId;
}
```
<span class="text-gray-300 text-xs" v-click="2">实体之间通过<strong>ID</strong>进行关联</span>

</div>
<div class="flex-1 flex flex-col">

```java {hide|all|7-9,13,20|3,10,17-19}{at:'4'}
// JPA
@Entity
public class User {
    @Id
    private Long id;

    // 用户拥有的角色
    @ManyToMany
    private List<Role> roles;
}

@Entity
public class Role {
    @Id
    private Long id;

    // 角色包含的用户
    @ManyToMany
    private List<User> users;
}
```
<span class="text-gray-300 text-xs" v-click="5">实体之间通过<strong>对象引用</strong>进行关联</span>

</div>
</div>

---

# 小结

<v-clicks>

- MyBatis-Plus 的实体之间通过**ID**进行关联，属于**弱**关联
  - `Order::customerId` -> `Customer::id`
  - `UserRole::userId` -> `User::id`
  - `UserRole::roleId` -> `Role::id`
- JPA 的实体之间通过**引用**进行关联，属于**强**关联
  - `Order::customer` -> `Customer`
  - `User::roles` -> `List<Role>`
  - `Role::users` -> `List<User>`
- MyBatis-Plus 并非严格意义上的**ORM**，只有**OM**，没有**R**（关系）

</v-clicks>

---
layout: center
---

# 核心功能

---
layout: center
title: 核心功能
---

1. <Link>实体映射</Link>
2. <Link>查询任意形状数据</Link>
3. <Link>保存任意形状数据</Link>
4. <Link>DTO 语言</Link>

<style>
li {
  font-size: 24px
}
</style>

---
layout: statement
---

# 1. 实体映射

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>
在 Jimmer 中，<strong>接口</strong> = 实体

```kotlin {all|3,20|5-7|9-11|13-15|17-19}{at:'1'}
// 用户实体
@Entity
interface User {

    // 主键
    @Id
    val id: Long

    // 唯一约束（手机号）
    @Key
    val phone: String

    // 多对多关联（角色）
    @ManyToMany
    val roles: List<Role>

    // 多对一关联（部门）
    @ManyToOne
    val department: Department
}
```

</div>

<div>
数据库模型

```sql {all|1,6|2|3|12-18,1,2,6,8-10|1,5,6,20-22}{at:'1'}
CREATE TABLE user (
    id BIGINT NOT NULL PRIMARY KEY,
    phone VARCHAR(20) NOT NULL UNIQUE,
    department_id BIGINT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department (id)
);

CREATE TABLE role (
    id BIGINT NOT NULL PRIMARY KEY
);

CREATE TABLE user_role_mapping (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES user (id),
    FOREIGN KEY (role_id) REFERENCES role (id)
);

CREATE TABLE department (
    id BIGINT NOT NULL PRIMARY KEY
);
```

</div>
</div>

---
layout: statement
---

### 接口带来的好处

公共字段可以**选择性**组合（多继承）

<div class="grid grid-cols-[1fr_1fr] gap-6" v-click="1">
<div>

```kotlin
// 创建相关
interface Created {
    val createdBy: Long // 创建人ID
    val createdTime: LocalDateTime // 创建时间
}
```

```kotlin
// 修改相关
interface Modified {
    val modifiedBy: Long? // 修改人ID
    val modifiedTime: LocalDateTime? // 修改时间
}
```

```kotlin
// 逻辑删除相关
interface LogicalDeleted {
    val deletedTime: LocalDateTime? // 删除时间
}
```

</div>

<div>
<div v-click="2">

```kotlin
// 操作日志
interface OperationLog : Created {
    ...
}
```

</div>

<div v-click="3">

```kotlin
// 字典
interface Dict : Created, Modified {
    ...
}
```

</div>

<div v-click="4">

```kotlin
// 订单
interface Order : Created, Modified, LogicalDeleted {
    ...
}
```

</div>

</div>
</div>

---
layout: statement
---

# 2. 查询任意形状数据

查询主表**指定**字段

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|3-5|9}{at:'1'}
val users = sqlClient.executeQuery(User::class) {
    select(table.fetchBy {
        name()  // 姓名
        phone() // 手机
        email() // 邮箱
    })
}

println(users)
```

```sql {all|2-4|none}{at:'1'}
SELECT
    t.name,
    t.phone,
    t.email
FROM user t;
```

</div>

<div>

```json {hide|hide|all}{at:'1'}
[
  {
    "name": "张三",
    "phone": "13200000000",
    "email": "example@gmail.com"
  },
  {
    "name": "李四",
    "phone": "13700000000",
    "email": "example@qq.com"
  }
  // ...
]
```

</div>
</div>

---
layout: statement
---

# 2. 查询任意形状数据

查询主表**全部**字段

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|3|7}{at:'1'}
val users = sqlClient.executeQuery(User::class) {
    select(table.fetchBy {
        allScalarFields() // 抓取全部字段
    })
}

println(users)
```

```sql {all|2-7|none}{at:'1'}
SELECT
    t.name,
    t.phone,
    t.email,
    t.age,
    t.gender,
    t.birthday
FROM user t;
```

</div>

<div>

```json {hide|hide|all}{at:'1'}
[
  {
    "name": "张三",
    "phone": "13200000000",
    "email": "example@gmail.com",
    "age": 28,
    "gender": "男",
    "birthday": "1997-09-30"
  }
  // ...
]
```

</div>
</div>

---
layout: statement
---

# 2. 查询任意形状数据

查询主表 + 关联表

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|3|4-7|8-10|14|15|16|17}{at:'1'}
val users = sqlClient.executeQuery(User::class) {
    select(table.fetchBy {
        phone() // 手机
        roles {
            code() // 角色编码
            name() // 角色名称
        }
        department {
            name() // 部门名称
        }
    })
}

val user = users[0]
val phone = user.phone
val roles = user.roles
val department = user.department
```

</div>

<div>

```json {all|none|none|none|2-17|3|4-13|14-16}{at:'1'}
[
  {
    "phone": "13200000000",
    "roles": [
      {
        "code": "ADMIN",
        "name": "管理员"
      },
      {
        "code": "VISITOR",
        "name": "访客"
      }
    ],
    "department": {
      "name": "应用开发部"
    }
  }
  // ...
]
```

</div>
</div>

---
layout: statement
---

# 2. 查询任意形状数据

查询主表 + 关联表（**更深层级**）

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|8-14|18|19}{at:'1'}
val users = sqlClient.executeQuery(User::class) {
    select(table.fetchBy {
        phone()
        roles {
            code()
            name()
        }
        department {
            name()
            manager {
                name() // 部门主管姓名
                phone() // 部门主管手机
            }
        }
    })
}

val department = users[0].department
val departmentManager = department.manager
```

</div>

<div>

```json {all|none|10-16|12-15}{at:'1'}
[
  {
    "phone": "13200000000",
    "roles": [
      {
        "code": "ADMIN",
        "name": "管理员"
      }
    ],
    "department": {
      "name": "应用开发部",
      "manager": {
        "name": "李四",
        "phone": "13700000000"
      }
    }
  }
  // ...
]
```

</div>
</div>

---
layout: statement
---

# 3. 保存任意形状数据

保存主表

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin
sqlClient.save(User {
    id = 1
    name = "张三"
    phone = "13200000000"
    email = "example@gmail.com"
})
```

</div>

<div>

```sql
INSERT INTO user (id, name, phone, email)
VALUES (1, '张三', '13200000000', 'example@gmail.com');
```

</div>
</div>

---
layout: statement
---

# 3. 保存任意形状数据

保存主表 + **多对一**关联

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|6-9|2-5}{at:'1'}
sqlClient.save(User {
    id = 1
    name = "张三"
    phone = "13200000000"
    email = "example@gmail.com"
    department {
        id = 2
        name = "应用开发部"
    }
})
```

</div>

<div>

```sql {all|1-2|4-5}{at:'1'}
INSERT INTO department (id, name)
VALUES (2, '应用开发部');

INSERT INTO user (id, name, phone, email, department_id)
VALUES (1, '张三', '13200000000', 'example@gmail.com', 2);
```

</div>
</div>

---
layout: statement
---

# 3. 保存任意形状数据

保存主表 + **多对多**关联

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|2-5|6-9}{at:'1'}
sqlClient.save(User {
    id = 1
    name = "张三"
    phone = "13200000000"
    email = "example@gmail.com"
    roles = listOf(
        Role { id = 2; code = "ADMIN" },
        Role { id = 3; code = "VIP" }
    )
})
```

</div>

<div>

```sql {all|1-2|4-6,8-10}{at:'1'}
INSERT INTO user (id, name, phone, email)
VALUES (1, '张三', '13200000000', 'example@gmail.com');

INSERT INTO role (id, code)
VALUES (2, 'ADMIN'),
       (3, 'VIP');

INSERT INTO user_role_mapping (user_id, role_id)
VALUES (1, 2),
       (1, 3);
```

</div>
</div>

---
layout: statement
---

# 3. 保存任意形状数据

保存主表 + **更深层级**关联

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all|9-13|6-8,14|2-5}{at:'1'}
sqlClient.save(User {
    id = 1
    name = "张三"
    phone = "13200000000"
    email = "example@gmail.com"
    department {
        id = 2
        name = "应用开发部"
        manager {
            id = 3
            name = "李四"
            phone = "13700000000"
        }
    }
})
```

</div>

<div>

```sql {all|1-2|4-5|7-8}{at:'1'}
INSERT INTO user (id, name, phone)
VALUES (3, '李四', '13700000000');

INSERT INTO department (id, name, manager_id)
VALUES (2, '应用开发部', 3);

INSERT INTO user (id, name, phone, email, department_id)
VALUES (1, '张三', '13200000000', 'example@gmail.com', 2);
```

</div>
</div>

---
layout: statement
---

# 4. DTO 语言

DTO爆炸问题：对于同一个实体，在不同的业务场景下需要定义不同的数据结构

<div class="grid grid-cols-2 gap-4">
<div>

```kotlin
// 简单的用户信息
data class SimpleUser(
    val name: String,
    val phone: String
)
```

```kotlin
// 用户+部门+主管信息
data class UserWithDepartment(
    val name: String,
    val phone: String,
    val department: Department
)

data class Department(
    val name: String,
    val manager: Manager
)
```

</div>

<div>

```kotlin
// 复杂的用户信息
data class ComplexUser(
    val name: String,
    val phone: String,
    val email: String,
    val age: Int,
    val gender: Gender,
    val birthday: LocalDate
)
```

```kotlin
// 用户+角色信息
data class UserWithRoles(
    val name: String,
    val phone: String,
    val roles: List<Role>
)
```

</div>
</div>

---
layout: statement
---

# 4. DTO 语言
<div class="grid grid-cols-2 gap-6">
<div>
<span>编写<code>User.dto</code>文件：</span>

```plaintext {all|all|1-4,10-11|4-6,9-10|6-9}
ComplexUser {
    name
    phone
    department {
        name
        manager {
            name
            phone
        }
    }
}
```

</div>

<div v-click="1">
<span><code>.dto</code>文件在编译后会自动生成<code>DTO对象</code>：</span>

```kotlin {hide|all|1-5|7-10|12-15}{at:'1'}
data class ComplexUser(
    val name: String,
    val phone: String,
    val department: Department
)

data class Department(
    val name: String,
    val manager: Manager
)

data class Manager(
    val name: String,
    val phone: String
)
```

</div>
</div>

---
layout: statement
---

# 4. DTO 语言
<p><code>DTO对象</code>可以在多种场景中使用：</p>

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {hide|all}{at:'1'}
// 作为HTTP接口的`入参`
@PostMapping("/users")
fun createUser(@RequestBody dto: CreateUserDTO) {
    // Jimmer 可以直接保存 DTO 对象
    sqlClient.insert(dto)
}
```

```kotlin {hide|all}{at:'2'}
// 作为HTTP接口的`返回值`
@GetMapping("/users/{id}")
fun findById(@PathVariable id: Long): SimpleUserDTO {
    // Jimmer 可以直接查询 DTO 对象
    return sqlClient.findById(SimpleUserDTO::class, id);
}
```

```kotlin {hide|all}{at:'3'}
// 作为查询的`条件`
@PostMapping("/users")
fun findPage(@RequestBody dto: ConditionDTO): List<User> {
    return sqlClient.executeQuery(User::class) {
        where(dto) // DTO 对象可以作为 where 的条件
        select(table)
    }
}
```

</div>

<div>

```plaintext {hide|all}{at:'1'}
input CreateUserDTO {
    name
    phone
    roles
    department
}
```

```plaintext {hide|all}{at:'2'}
SimpleUserDTO {
    name
    phone
    email
    gender
}
```

```plaintext {hide|all}{at:'3'}
specification ConditionDTO {
    eq(phone)
    like(name)
    like(email)
    ge(birthday)
    le(birthday)
    valueIn(gender)
}
```

</div>
</div>

---

# 小结

<v-clicks>

- Jimmer 使用**接口**表达实体
  - 公共字段的粒度更小（可以随意组合）
- Jimmer 将**任意形状**的数据结构作为一个**整体**进行读写操作，从而可以：
  - 查询**任意深度**的数据结构
  - 保存**任意深度**的数据结构
- 通过编写 DTO 语言，能够快速地构建**输入**/**输出**对象

</v-clicks>

---
layout: center
---

# 业务案例

---
layout: center
title: 业务案例
---

1. <Link>条件查询</Link>
2. <Link>多表关联保存</Link>
3. <Link>递归查询</Link>
4. <Link>唯一性约束校验</Link>
5. <Link>多条件分页查询</Link>

<style>
li {
  font-size: 24px
}
</style>

---
layout: statement
---

# 1. 条件查询

业务场景①：查询名叫"张三"的用户

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin {all}
// Jimmer
val users = sqlClient.executeQuery(User::class) {
    where(table.name eq "张三")
    select(table)
}
```

</div>

<div>

```java {hide|all}
// MyBatis-Plus
QueryWrapper<User> query = new QueryWrapper<>();
query.eq("name", "张三");
var users = userMapper.selectList(query);
```

</div>
</div>

---
layout: statement
---

# 1. 条件查询

业务场景②：查询"应用开发部"下的所有用户

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all|3-4}
// Jimmer
val users = sqlClient.executeQuery(User::class) {
    // 部门的名称等于"应用开发部"
    where(table.department.name eq "应用开发部")
    select(table)
}
```
<span class="text-gray-300 text-xs" v-click="1">直接根据关联表的属性<code>table.department.name</code>进行过滤</span>

</div>

<div class="flex-1 flex flex-col">

```java {hide|all}
// MyBatis-Plus
// 1. 先查部门
QueryWrapper<Department> query1 = new QueryWrapper<>();
query1.eq("name", "应用开发部");
var department = departmentMapper.selectOne(query1);

// 2. 再查用户
QueryWrapper<User> query2 = new QueryWrapper<>();
query2.eq("department_id", department.getId());
var users = userMapper.selectList(query2);
```
<span class="text-gray-300 text-xs" v-click="2">分步查询</span>

</div>
</div>

---
layout: statement
---

# 1. 条件查询

业务场景③：查询"李四"主管部门下的所有用户

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all|3-4}
// Jimmer
val users = sqlClient.executeQuery(User::class) {
    // 部门的主管的姓名等于"李四"
    where(table.department.manager.name eq "李四")
    select(table)
}
```
<span class="text-gray-300 text-xs" v-click="1">不论多深的关联层级，都只需要一行代码</span>

</div>

<div class="flex-1 flex flex-col">

```java {hide|all}
// MyBatis-Plus
// 1. 先查主管
QueryWrapper<User> query1 = new QueryWrapper<>();
query1.eq("name", "李四");
var user = userMapper.selectOne(query1);

// 2. 再查部门
QueryWrapper<Department> query2 = new QueryWrapper<>();
query2.eq("manager_id", user.getId());
var department = departmentMapper.selectOne(query2);

// 3. 再查用户
QueryWrapper<User> query3 = new QueryWrapper<>();
query3.eq("department_id", department.getId());
var users = userMapper.selectList(query3);
```
<span class="text-gray-300 text-xs" v-click="2">关联层级越深，所需要的查询步骤就越多</span>

</div>
</div>

---
layout: statement
---

# 2. 多表关联保存

业务场景：在用户编辑页面，可以修改用户的基本信息、关联的角色，然后保存

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all}
// Jimmer
sqlClient.save(User {
    id = 1
    // 基本信息
    name = "张三"
    phone = "13200000000"
    // 关联的角色
    roles = listOf(
        Role { id = 2 },
        Role { id = 3 }
    )
})
```
<span class="text-gray-300 text-xs" v-click="1">只需要构建你想保存的数据形状即可</span>

</div>

<div class="flex-1 flex flex-col" v-click="2">

```java {all}
// MyBatis-Plus
// 1. 先更新主表
var user = new User();
user.setId(1);
user.setName("张三");
user.setPhone("13200000000");
userMapper.updateById(user);

// 2. 用户-角色关联表 先删后增
QueryWrapper<UserRole> query = new QueryWrapper<>();
query.eq("user_id", 1);
userRoleMapper.delete(query);

var userRoles = List.of(
    new UserRole(1, 2),
    new UserRole(1, 3)
);
userRoleMapper.insert(userRoles);
```

<v-click at="3">

1. 每张表单独处理
2. 一对多关联需要先删后增
3. 如果关联表下面还有关联表，代码复杂度直线上升
<span class="block">举例：商品 > SKU > SKU属性</span>

</v-click>

</div>
</div>

<style>
li {
    font-size: 12px;
}
</style>

---
layout: statement
---

# 3. 递归查询

业务场景：递归查询部门树（实体定义）

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all|3,12-14,19|3,16-18,19}
// Jimmer 部门实体
@Entity
interface Department {

    // 主键
    @Id
    val id: Long

    // 部门名称
    val name: String

    // 上级部门（自关联）
    @ManyToOne
    val parent: Department?

    // 下级部门（自关联）
    @OneToMany
    val children: List<Department>
}
```

</div>

<div v-click>

```java
// MyBatis-Plus 部门实体
@Data
public class Department {

    // 主键
    @TableId
    private Long id;

    // 部门名称
    private String name;

    // 上级部门ID
    private Long parentId;

    // 下级部门（虚拟字段）
    @TableField(exist = false)
    private List<Department> children;
}
```

</div>
</div>

---
layout: statement
---

# 3. 递归查询

业务场景：递归查询部门树（查询逻辑）

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all|3,5|6}{at:'1'}
// Jimmer
val roots = sqlClient.executeQuery(Department::class) {
    where(table.parentId.isNull()) // 查询所有根节点
    select(table.fetchBy {
        allScalarFields() // 抓取所有字段
        `children*`() // 递归查询children
    })
}
```
<span class="text-gray-300 text-xs" v-click="2"><strong>自关联</strong>属性，天然支持递归</span>

</div>

<div class="flex-1 flex flex-col" v-click="3">

```java {hide|all|2-4|6-8|10-20}{at:'3'}
// MyBatis-Plus
QueryWrapper<Department> query = new QueryWrapper<>();
query.isNull("parentId");
var roots = departmentMapper.selectList(query); // 查询所有根节点

for (var root : roots) {
    setChildrenRecursively(root); // 递归设置 children 字段
}

// 自定义递归函数
public void setChildrenRecursively(Department parent) {
    QueryWrapper<Department> query = new QueryWrapper<>();
    query.eq("parentId", parent.getId());
    var children = departmentMapper.selectList(query);

    parent.setChildren(children);
    for (var child : children) {
        setChildrenRecursively(child); // 递归
    }
}
```
<span class="text-gray-300 text-xs" v-click="3">需要自定义递归函数</span>

</div>
</div>

<style>
code {
    font-size: 12px !important;
}
</style>

---
layout: statement
---

# 4. 唯一性约束校验

业务场景：新增用户，当手机号已存在时，抛出业务异常

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {all|7-9}
// Jimmer
try {
    sqlClient.insert(User {
        phone = "13205007769"
    })
}
catch (ex: SaveException.NotUnique) {
    throw BusinessException("手机号已存在")
}
```
<span class="text-gray-300 text-xs" v-click="1">Jimmer 将数据库的唯一性约束冲突转化为统一的异常<code>SaveException</code></span>

</div>

<div class="flex-1 flex flex-col" v-click="2">

```java
// MyBatis-Plus
// 1. 先查询
QueryWrapper<User> query = new QueryWrapper<>();
query.eq("phone", "13205007769");
var exists = userMapper.selectOne(query);

if (exists) {
    throw new BusinessException("手机号已存在");
}

// 2. 再插入
var user = new User();
user.setPhone("13205007769");
userMapper.insert(user);
```

<v-click at="3">

1. 代码繁琐
2. 造成不必要的查询
3. 潜在的并发问题

</v-click>

</div>
</div>

<style>
li {
    font-size: 12px;
}
</style>

---

# 5. 多条件分页查询

![logo](/images/分页查询.png)

业务场景：用户列表，根据下列条件进行分页查询：
- 姓名 -> 输入框（模糊查询）
- 手机号 -> 输入框（精确查询）
- 状态 -> 多选下拉框
- 所在部门 -> 单选下拉框
- 创建时间 -> 时间范围

---
layout: statement
---

# 5. 多条件分页查询

Jimmer 代码示例

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```plaintext
// 编写 DTO 语言
specification UserPageCondition {
    like(name)
    eq(phone)
    valueIn(status)
    associatedIdEq(department)
    ge(createdTime)
    le(createdTime)
}
```
<span class="text-gray-300 text-xs">使用 DTO 语言的<strong>内置函数</strong>来表达查询条件</span>

</div>

<div class="flex-1 flex flex-col">

```kotlin {all|6,9}
// HTTP 接口
@PostMapping("/findPage")
fun findPage(
    @RequestParam pageIndex: Int,
    @RequestParam pageSize: Int,
    @RequestBody condition: UserPageCondition // DTO 对象
): Page<User> {
    return sqlClient.createQuery(User::class) {
        where(condition) // DTO 对象作为 where 的条件
        select(table)
    }.fetchPage(pageIndex, pageSize)
}
```
<v-click at="1">

1. DTO 对象作为`@RequestBody`参数，对外暴露接口入参
2. DTO 对象作为`where`条件，对内转化为查询条件

</v-click>

</div>

</div>

<style>
li {
    font-size: 12px;
}
</style>

---

# 5. 多条件分页查询

MyBatis-Plus 代码示例

<div class="grid grid-cols-[1fr_1fr] gap-4">
<div class="flex-1 flex flex-col">

```java
// 定义 DTO 对象
@Data
public class UserPageCondition {
    private String name;
    private String phone;
    private List<Status> statusList;
    private Long departmentId;
    private LocalDateTime minCreatedTime;
    private LocalDateTime maxCreatedTime;
}
```

</div>

<div class="flex-1 flex flex-col">

```java
// HTTP 接口
@PostMapping("/findPage")
public Page<User> findPage(
    @RequestParam int pageIndex,
    @RequestParam int pageSize,
    @RequestBody UserPageCondition condition
) {
    QueryWrapper<User> query = new QueryWrapper();
    query.like(StringUtils.isNotEmpty(condition.name), "name", condition.name);
    query.eq(StringUtils.isNotEmpty(condition.phone), "phone", condition.phone);
    query.in(!condition.statusList.isEmpty(), "statusList", condition.statusList);
    query.eq(condition.departmentId != null, "departmentId", condition.departmentId);
    query.ge(condition.minCreatedTime != null, "createdTime", condition.minCreatedTime);
    query.le(condition.maxCreatedTime != null, "createdTime", condition.maxCreatedTime);

    var page = new Page(pageIndex, pageSize);
    return userMapper.selectPage(page, query);
}
```

<v-click at="1">

1. 代码繁琐
2. 仅支持单表

</v-click>

</div>

</div>

<style>
code {
    font-size: 11px;
}

li {
    font-size: 12px;
}
</style>

---
layout: center
---

# 其他内容（待定）

- 和其他框架的性能对比
- 客户端代码生成
