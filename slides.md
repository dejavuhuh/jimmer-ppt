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

<!--
今天给大家分享一下 Jimmer 这个 ORM 框架
-->

---
layout: center
title: 大纲
---

1. <Link>ORM 概述</Link>
2. <Link>核心功能</Link>
3. <Link>业务案例</Link>
4. <Link>最佳实践</Link>

<style>
li {
  font-size: 24px
}
</style>

<!--
我主要讲四个部分，首先是关于 ORM 这个概念，我会进行一个简短的概述；然后着重介绍一下 Jimmer 这个框架的一些核心功能；紧接着我会结合实际的业务案例，带大家看一下，在平时的业务开发中，我们用 Jimmer 和用 MyBatis-Plus 具体会有怎样的一个区别；最后我会简单的聊一下，我在实际的开发过程中，总结出来的一些在 Jimmer 使用上的最佳实践，供大家参考。
-->

---
layout: center
---

# ORM 概述

<!--
好，那我们先从 ORM 的概念讲起
-->

---
layout: cover
---

# ORM (对象关系映射)

是一种在编程语言**对象**和数据库**模型**之间建立**映射关系**的技术

<!--
ORM 的全称是"对象关系映射"，简单来说呢，它是一种在编程语言的对象和数据库的模型之间建立起这么一种映射关系的技术，或者说手段
-->

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

<!--
我们可以举这么一个例子，比方说一个很常见的一对多关联，一个客户可以拥有多笔订单，一个订单只能归属于一个客户。

对于这么一个关系模型，在 MyBatis-Plus 中我们会定义两个实体（也就是俗称的 Entity 对象），一个 Customer，客户对象，和一个 Order，订单对象。
这里，Customer 上的 ID 和 Order 上的 customerId 其实对应的就是数据库里的主键和外键，所以这两个字段之间是有这么一个关联关系在的。

我们再来看另外一个 ORM 框架是如何定义这两个实体，不知道大家有没有了解过 JPA，这个也是 Java 生态下面非常流行的一个 ORM 框架。
那在 JPA 当中，实体之间不再通过 ID 进行关联，而是通过对象本身。

我们可以看到，在 Order 上，有一个 Customer 对象（而不是 customerId），这表示说这个订单所归属的客户

那反过来呢，在 Customer 上，也有一个 Order 的 List，这表示啥呢，这表示这个客户所拥有的订单（因为可以拥有多个订单，所以是一个 List 嘛）。
JPA 这种表达方式，其实更符合一种面向对象的思维模式，这种模式带来一个好处就是，你只要看到 Order 上的 Customer 对象，你就知道这两个表之间是有关联关系的，而如果是 MyBatis-Plus 这种通过 ID 关联的方式，你只能通过命名规范去约束这种关系，比如说这边的 customerId，因为它叫 customerId，你才知道它是 Customer 表的 ID，但如果它不叫 customerId 呢，比如说有些开发人员偷懒，写了一个缩写叫 custId，你其实并不能马上 get 到这是哪张表的 ID，所以这个就带来了一定程度的理解负担。
那我们今天要介绍的 Jimmer，它其实是和 JPA 这种模式比较像。
-->

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

<!--
类似的，在多对多关联中，比如用户和角色。

那对于 MyBatis-Plus 来说，就需要定义一个中间表实体（也就是这里的 UserRole 对象）来承载这个多对多关系，同样的，实体之间也是通过 ID 去进行一个关联。

那 JPA 这边呢，最大的一个区别就是，它可以省去中间实体的定义，只需要在两边的实体上定义对方的 List，比如这边的“用户拥有的角色”以及“角色包含的用户”，其实就隐含了一个双向的多对多关联。
-->

---

# 小结

<v-clicks>

- MyBatis-Plus 的实体之间通过**ID**进行关联，属于**弱**关联
  - `Order::customerId` -> `Customer::id`
  - `UserRole::userId` -> `User::id`
  - `UserRole::roleId` -> `Role::id`
- JPA 的实体之间通过**对象引用**进行关联，属于**强**关联
  - `Order::customer` -> `Customer`
  - `User::roles` -> `List<Role>`
  - `Role::users` -> `List<User>`
- MyBatis-Plus 并非严格意义上的**ORM**，只有**OM**，没有**R**（关系）

</v-clicks>

<!--
总结一下，MyBatis-Plus 的实体之间通过 ID 进行关联，这种是属于弱关联。

JPA 的实体之间通过对象引用进行关联，这种属于强关联。

所以我们说，MyBatis-Plus 其实并非严格意义上的 ORM，它只有 O 和 M 的部分（也就是它有对象，还有映射），但是它没有 R 的部分（也就是关系）。
-->

---
layout: center
---

# 核心功能

<!--
接下来我们正式进入 Jimmer 框架的核心功能的讲解。
-->

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

<!--
它的核心功能主要有：实体映射、查询任意形状数据、保存任意形状数据，还有 DTO 语言。最后这个 DTO 语言可能听起来有点不明所以，等我待会讲到这里的时候再来具体解释这个概念。
-->

---
layout: statement
---

# 1. 实体映射

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>
在 Jimmer 中，<strong>接口</strong> = 实体

```kotlin {all|2-3,20|5-7|9-11|13-15|17-19}{at:'1'}
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

<!--
首先是实体映射，在 Jimmer 中，接口等于实体，这是它与其他框架的一个很大的区别。

首先，这个`Entity`注解表示它是一个实体。

然后`Id`注解对应的是数据库中的主键。

`Key`注解呢，对应的是数据库中的唯一约束字段，比方这里的手机号，在用户表中就是唯一的。

接下来这个`ManyToMany`注解用来定义用户和角色的一个多对多关联，那这里就和前面那个 JPA 的例子比较像了。

同样的，我们通过这个`ManyToOne`注解来定义用户和部门之间的多对一关系，表示说，这个用户他所归属的部门。
-->

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

<!--
使用接口来定义实体会带来一些意想不到的好处，其中最方便的一个地方就是，所谓的公共字段可以选择性地进行组合。

比方说我们这边可以定义多个维度的公共实体，有创建相关的：创建人ID、创建时间这种，还有修改相关的，以及逻辑删除相关的。

然后呢，在具体的使用中，比如说操作日志这种表，它可能只需要创建人和创建时间，它既不会被修改，也不会被删除，那么它就可以只继承和创建有关的这个公共实体。

再比如，这个字典表，它会被创建也会被修改，但是不需要逻辑删除，那么它就只需要继承这两个公共实体。

那同理，如果你同时需要这三个维度的公共字段，那就继承这三个实体就好了。总之一句话概括就是：按需继承，我们可以选择性地去组合你所需要的公共字段。而这个事情在 MyBatis-Plus 的体系下是比较难做到的，
因为显而易见，class 只能单继承，所以通常我们就会被迫去让所有表都继承一个很庞大的`BaseEntity`，上面可能罗列了7到8个公共字段，有可能你这张表本身的业务字段就没几个（就2、3个），然后公共字段占了7、8个，这就非常的不合理。
-->

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

<!--
那下一个功能，查询任意形状的数据，我们先从一个简单的例子开始，比方说，我想要查询用户表的名字、手机号和邮箱字段，那这里展示的代码呢就是 Jimmer 的一个写法，我简单说明一下。首先，这里的 sqlClient 是 Jimmer 框架对外暴露的 API 的一个总入口，所有的增删改查操作都是从这里去调用，那么 executeQuery 表示我要执行一个查询，紧接着传入一个 User 的 class 表示我要将用户表作为查询的主表，主表的含义呢就是说，打个比方，你在写 SQL 的时候，SELECT * FROM 某张表，这里 from 的表就是主表。然后，后面这个花括号里的内容是 kotlin 的 lambda 表达式的写法，那我这里先不去过多展开这里 lambda 的语法为什么可以写成这样（如果大家感兴趣的话，最后我可以再扩展讲一些 kt 相关的内容），那我们只需要知道在 lambda 表达式里面，我们可以对这一次查询做一些相关的设置。

比如这里，我指定了主表上需要查询的三个字段，而最终生成的 SQL 语句呢，也仅仅只会包含这三个字段，而不会去查询多余的字段

那么最终查询出来的结果就是右边的这个 JSON 结构。
-->

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

<!--
然后如果我们要查询一张表的所有字段，就可以调用 Jimmer 提供的一个快捷 API。

这个叫做 allScalarFields，那最终生成的 SQL 就会包含所有字段。
-->

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

<!--
那接下来这个例子呢，我不仅要查询用户主表上的数据，还要查询用户关联的角色列表以及用户所在的部门信息，这里的角色和部门都是 User 表的关联表，那么在 Jimmer 中，由于我们在实体上已经定义了它和其他关联对象的关系，于是我们就可以一次性把这些关联对象都查询出来。

那么这里的 phone 就是主表上的字段。

这里的 roles 表示我要查询这个用户关联的角色列表，并且还可以进一步指定我们需要角色上的 code 和 name 属性。

包括这里的 department 也是同样的道理。

那最终我们就会得到右边这样的一个 JSON 结构，它是一个包含嵌套关系的对象数组
-->

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

<!--
更进一步，我们还可以继续查询关联对象上的关联对象。

比如说这里的部门，我们可以继续往下嵌套，去查询该部门的主管信息。

那最终得到的这个数据结构也会嵌套一样多的层级。
-->

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

<!--
好，我们接下来说一下保存任意形状数据的功能。也是先从一个简单的例子开始，我们想要保存用户主表的信息，那就是调用 sqlClient.save 方法，并传入一个 User 对象
-->

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

<!--
和查询类似，除了主表之外，我们还可以同时指定我们要保存的关联数据，也就是用户本身的信息和它所在部门的信息，也可以一次性保存。
-->

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

<!--
同样的道理，对于角色这种多对多关联，也可以和主表一起进行保存。

我们可以看到右边生成的 SQL，除了角色表本身之外，还包括了用户和角色的关联关系表。
-->

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

<!--
那既然是保存任意形状，对于这种嵌套多层的数据结构，自然也是没问题。

Jimmer 会根据实体之间的依赖关系，按顺序生成对应的 SQL 语句。

那通过前面这些例子，我们会发现一个规律，就是不管是查询还是保存，我们都可以从一个主表出发，然后延伸到它的关联表，以及关联表的关联表，最终，会形成一个树的形状，而主表就是树的根节点。于是，我们只需要向 Jimmer 描述我们想要查询的数据的形状，它就会帮我们一次性把整个树给查询出来，或者是一次性把整个树给保存到数据库，而我们并不需要关心这背后的运行了哪些 SQL，以及这些 SQL 的执行顺序，这是一种非常面向对象的思维方式。
-->

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

<!--
最后我们要讲的一个功能叫做 DTO 语言，那首先我们先讲一个开发人员经常会遇到的问题，这个问题叫做 DTO 爆炸。那么什么是 DTO 爆炸呢，首先，我们的数据库实体形状是固定的，但是我们暴露出去的接口，这些接口的入参和出参都不一定会和数据库实体能够完全对应的上。比如说同样是用户的查询逻辑，有的接口只需要返回简单的用户信息，而有的接口需要返回复杂的甚至有嵌套结构的用户信息。于是，我们就会被迫在不同的业务场景下，去定义各式各样的 DTO 对象。除此之外，开发人员还需要额外去编写 DTO 和数据库实体之间的转换关系，除了增加无意义的时间成本外，还变相提高了代码的复杂度。
-->

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
<span><code>.dto</code>文件在编译后会自动生成 <strong>DTO对象</strong>：</span>

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

<!--
那么 Jimmer 是如何解决这个问题的呢，它发明了一种新的语法，允许我们编写一个 DTO 文件去快速定义各式各样的 DTO 形状。

这个 DTO 文件在编译后，会生成对应的 DTO 对象，这些对象可以直接作为保存接口的入参，以及查询接口的出参，而数据库实体和这些 DTO 之间的转换逻辑，我们则不需要关心，由 Jimmer 自动完成。
-->

---
layout: statement
---

# 4. DTO 语言
<p><strong>DTO对象</strong>可以在多种场景中使用：</p>

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

<!--
由 DTO 文件生成的 DTO 对象可以在多种场景中使用。

第一种，作为 HTTP 接口的入参，这里我们通过 input 关键字定义了一个输入类型的 DTO，并将它作为 HTTP 接口的 @RequestBody。然后 Jimmer 就可以直接保存这个 DTO 对象，而不需要先将它转换为数据库实体。

第二种，作为 HTTP 接口的返回值，同样的，Jimmer 可以直接查询出这个 DTO 对象，而不需要先查询实体，然后再将实体转换为 DTO 对象。

最后一种，作为查询的条件，一个很常见的例子就是列表查询，我们可能会有若干个字段作为查询条件，有的字段需要精确匹配，有的字段需要模糊匹配，而有的字段则需要满足某个范围（比如时间），此时可以通过 DTO 语言的特殊语法去定义这个查询条件，最终将生成的 DTO 对象作为 where 的条件。
-->

---

# 小结

<v-clicks>

- Jimmer 使用**接口**表达实体
  - 公共字段的粒度更小（可以随意组合）
- Jimmer 将**任意形状**的数据结构作为一个**整体**进行读写操作，从而可以：
  - 查询**任意深度**的数据结构
  - 保存**任意深度**的数据结构
- 通过编写 DTO 文件，能够快速地构建**输入**/**输出**对象

</v-clicks>

---
layout: center
---

# 业务案例

<!--
OK，那接下来我将结合实际的业务案例，带大家看一下，在不同的业务场景下，使用 Jimmer 和 MyBatis-Plus 开发的一个对比情况。
-->

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

<!--
我这边是挑选了几个比较有代表性的业务场景，来给大家做一个对比。
-->

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

<!--
首先是条件查询，比如最简单的，我要查询名叫“张三”的用户，那左边是 Jimmer 的写法，右边是 MyBatis-Plus 的写法。
-->

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

<!--
稍微复杂一点，我要查询“应用开发部”下的用户，在 Jimmer 中，此时查询主表仍然是“用户”。

但我们可以直接通过关联表的属性进行过滤。

而在 MyBatis-Plus 中，我们需要先查询出部门，再根据部门 ID 去查询用户。
-->

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

<!--
如果再复杂一点，我们需要根据关联表的关联表的属性进行过滤，比方说这里我们需要根据部门的主管的名字去筛选用户。

在 Jimmer 中，不论多深的关联层级，都只需要一行代码。

而在 MyBatis-Plus 中，关联层级越深，所需要的查询步骤就越多。
-->

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

<!--
然后是多表关联保存的场景，比如说在用户编辑页面，我们可以修改用户的基本信息、关联的角色，然后保存。

我们在前面已经提到过，Jimmer 可以一次性保存任意形状的数据，因此，只需要构建你想保存的数据形状，然后调用 save 方法即可。

而在 MyBatis-Plus 中，我们不仅要单独处理每一张表的更新逻辑，遇到多对多关联时，还需要先删后增。可想而知，如果关联表下面还有关联表，代码复杂度将直线上升。
-->

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

<!--
然后是递归查询的场景，这里我想要递归查询部门树，我们先看一下 Jimmer 的实体定义。

首先，这里有一个 parent 属性，它是一个自关联的属性，表示上级部门。

以及一个 children 属性，它也是一个自关联的属性，表示下级部门。

然后右边是 MyBatis-Plus 的实体定义。
-->

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

<!--
然后我们看一下递归的代码实现。

在 Jimmer 中，首先通过 where 条件查询所有根节点，并指定要抓取所有字段。

然后，由于 children 是自关联属性，可以通过 Jimmer 内置的递归方法（也就是这里的 `children*` ）对所有下级部门进行递归查询。

而在 MyBatis-Plus 中，我们通常需要定义一个辅助的递归函数。
-->

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

<!--
下面一个场景是唯一性约束校验，比如说新增用户，当手机号已存在时，抛出业务异常。

由于 Jimmer 将数据库的唯一性约束冲突转化为统一的异常 SaveException，因此我们只需要捕获这个异常，然后再抛出自定义的业务异常即可。

而在 MyBatis-Plus 中，最常见的做法就是先查询，再插入。

这一做法会带来几个问题：首先显而易见的是代码繁琐。其次是会造成查询浪费，因为在大多数情况下可能手机号都不会发生冲突，但，我们为了友好的用户提示，我们不得不多查询一次。最后就是，这种写法其实是存在并发问题的，因为查询和插入并不是一个原子操作，假设此时有两个线程同时进入这段逻辑，并且手机号一致，那么就有可能两个线程都查询到了手机号不存在，于是都认为可以插入数据，最终导致冲突。
-->

---

# 5. 多条件分页查询

![logo](/images/分页查询.png)

业务场景：用户列表，根据下列条件进行分页查询：
- 姓名 -> 输入框（模糊查询）
- 手机号 -> 输入框（精确查询）
- 状态 -> 多选下拉框
- 所在部门 -> 单选下拉框
- 创建时间 -> 时间范围

<!--
最后一个场景是一个很常见的多条件分页查询，比方说我们有一个用户列表，需要根据下面这些条件进行分页查询。
-->

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

<!--
在前面我们介绍了 DTO 语言，因此这里可以借助 DTO 语言快速生成分页查询的条件对象。

DTO 对象作为 @RequestBody 的参数，对外暴露接口入参。同时，作为 where 条件，对内转化为查询条件。
-->

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

<!--
而在 MyBatis-Plus 中。

整个代码就会相对繁琐一点，并且最大的问题是，它仅支持单表查询。
-->

---
layout: center
---

# 最佳实践

<!--
最后我来简单聊一下，我在实际的开发过程中，总结出来的一些在 Jimmer 使用上的最佳实践，供大家参考。
-->

---

# 最佳实践

<v-clicks>

- 非空字段明确指定`NOT NULL`约束
  - 原因：`kotlin`严格区分非空/可空字段
- 不允许重复的字段加上`UNIQUE`约束
  - `user`表的`phone`字段
  - `menu`表的`parent_id`和`name`字段（联合唯一索引）
- 推荐使用数据库真外键（仅代表个人观点）
  - 可以确保数据的一致性（**不会产生脏数据**）
  - 清理测试数据更放心（**不容易误删**）
  - 通常不会成为性能瓶颈，需要极致性能的地方再考虑假外键
- 新项目（尤其是 kotlin 项目）很推荐使用 Jimmer，但已有项目的改造难度大（不推荐重构）

</v-clicks>

---

# 附录

1. [ORM 框架性能对比](https://jimmer.deno.dev/zh/docs/overview/benchmark)

---
layout: end
---

# 谢谢观看
