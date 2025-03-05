---
layout: two-cols
---

# 快速上手

从一个简易的订单模型开始

![logo](/images/订单.png)

::right::

<v-click at="1">

# 实体定义

在 Jimmer 中，**接口** = 实体

```kotlin {hide|all|3|5-6|11-13|15-17}{at:'1'}
// 订单
@Entity
interface Order {

    @Id
    val id: Long

    // 订单号
    val orderNo: String

    // 客户
    @ManyToOne
    val customer: Customer

    // 订单项数组
    @OneToMany
    val orderItems: List<OrderItem>
}
```

</v-click>

---
layout: two-cols
---

### 客户实体

```kotlin {all|13-15}{at:'1'}
@Entity
interface Customer {

    @Id
    val id: Long

    // 客户姓名
    val name: String

    // 客户地址
    val address: String

    // 订单数组
    @OneToMany
    val orders: List<Order>
}
```

::right::

### 订单项实体

```kotlin {all|13-15}{at:'1'}
@Entity
interface OrderItem {

    @Id
    val id: Long

    // 商品标题
    val title: String

    // 商品价格
    val price: BigDecimal

    // 订单
    @ManyToOne
    val order: Order
}
```

---
layout: statement
---

# 保存任意形状

```kotlin {all|1,2,16|4-7|8-15|18-19}
// 构建一个订单对象
val order = Order {
    orderNo = "xxxxxxxxxxxxx"
    customer {
        name = "张三"
        address = "广州市番禺区汉溪大道"
    }
    orderItems().addBy {
        title = "iPhone 16 Pro Max"
        price = BigDecimal("9000")
    }
    orderItems().addBy {
        title = "iPad mini 7"
        price = BigDecimal("4500")
    }
}

// 保存至数据库
sqlClient.save(order)
```

---
layout: statement
---

# 查询任意形状

<div class="grid grid-cols-2 gap-16">
<div class="prose">

```kotlin {all|1,2,12|4-7|8-11|14-15|17-18|20-21}{at:'1'}
// 构建一个`Fetcher`对象
val fetcher = newFetcher(Order::class).by {
    orderNo()
    customer {
        name()
        address()
    }
    orderItems {
        title()
        price()
    }
}

// 查询订单实体
val order = sqlClient.findById(fetcher, 1)

// 客户
val customer = order.customer

// 订单项
val orderItems = order.orderItems
```

</div>

<div class="prose">

```json {hide|all|3-6|7-16}{at:'4'}
{
  "orderNo": "xxxxxxxxxxxxx",
  "customer": {
    "name": "张三",
    "address": "广州市番禺区汉溪大道"
  },
  "orderItems": [
    {
      "title": "iPhone 16 Pro Max",
      "price": "9000"
    },
    {
      "title": "iPad mini 7",
      "price": "4500"
    }
  ]
}
```

</div>
</div>

---
layout: statement
---

# 条件查询

```kotlin {all|3}
// 订单号以`2`开头的订单
val orders = sqlClient.executeQuery(Order::class) {
    where(table.orderNo like "2%")
    select(table)
}
```

```kotlin {hide|all|3}
// 客户姓名为`张三`的订单
val orders = sqlClient.executeQuery(Order::class) {
    where(table.customer.name eq "张三")
    select(table)
}
```

```kotlin {hide|all|3-5}
// 包含金额大于100的订单项的订单
val orders = sqlClient.executeQuery(Order::class) {
    where(table.orderItems {
        price gt BigDecimal("100")
    })
    select(table)
}
```

---

# Jimmer 的核心理念

Jimmer的核心理念，在于`任意形状`的数据结构作为一个`整体`进行读写操作，而非简单的处理实体对象

<v-click>

- 保存任意形状的数据结构
- 查询任意形状的数据结构
- 构建任意深度的查询条件

</v-click>

---
layout: cover
---

# 实用功能

- 保存指令
- 动态更新
- 递归查询
- 唯一性约束校验

---
layout: statement
---

# 保存指令

<p class="!mb-0">保存指令允许开发人员保存任意形状的数据结构，而非保存简单的对象</p>

<div class="grid grid-cols-[2fr_3fr] gap-4">
<div class="prose">

![logo](https://jimmer.deno.dev/zh/assets/images/save-d37c62a7516ccbf2bc561f935cf77de2.webp)
<span class="text-gray-300 text-xs">图中的数字表示数据的 ID</span>

</div>
<div class="prose mt-2">
<v-clicks depth="2">

- **左上角**：当前数据库中已有的数据结构（**旧数据**）
- **右上角**：用户期望的数据结构（**新数据**）
- **下方**：对比新旧数据结构，找出**差异**并执行相应的SQL操作，使旧数据转变成新数据：
  - <span style="color: orange">橙色部分</span>：对于在新旧数据结构中存在的实体对象，如果某些属性发生变化，修改数据
  - <span style="color: hsl(210, 100%, 50%)">蓝色部分</span>：对于在新旧数据结构中存在的实体对象，如果某些关联发生变化，修改关联
  - <span style="color: green">绿色部分</span>：对于在新数据结构中存在但在旧数据结构中不存在实体对象，插入数据并建立关联
  - <span style="color: red">红色部分</span>：对于在旧数据结构中存在但在新数据结构中不存在实体对象，对此对象进行脱钩，清除关联并有可能删除数据

</v-clicks>
</div>
</div>

---
layout: statement
---

# 2. 动态更新

业务场景①：更新`user`表的`email`字段，忽略其他字段

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div>

```kotlin
// Jimmer
sqlClient.update(User {
    id = 1
    email = "demo@gmail.com"
})
```

</div>

<div v-click="1">

```java
// MyBatis-Plus
var user = new User();
user.setId(1);
user.setEmail("demo@gmail.com");
userMapper.updateById(user);
```

</div>
</div>
<v-click at="2">
业务场景②：更新<code>user</code>表的<code>email</code>字段为<code>null</code>

<div class="grid grid-cols-[1fr_1fr] gap-6">
<div class="flex-1 flex flex-col">

```kotlin {hide|all}{at:'2'}
// Jimmer
sqlClient.update(User {
    id = 1
    email = null
})
```
<span class="text-gray-300 text-xs" v-click="3">Jimmer 可以区分<code>更新为null</code>和<code>忽略更新</code>这两种情况</span>

</div>

<div>

```java {hide|1-6|5|8-11}{at:'4'}
// MyBatis-Plus
// 错误写法 ❌
var user = new User();
user.setId(1);
user.setEmail(null); // 默认情况下`null`会被忽略
userMapper.updateById(user);

// 正确写法 ✅
UpdateWrapper<User> wrapper = new UpdateWrapper<>();
wrapper.eq("id", 1).set("email", null);
userMapper.update(wrapper);
```

</div>
</div>
</v-click>

<style>
code {
    font-size: 11px !important;
}
</style>

---
layout: cover
---

# 谢谢观看
