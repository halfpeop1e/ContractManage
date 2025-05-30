# ContractManage
1.初次使用请在控制台使用npm install安装所有的依赖
2.后端在处理post，put等请求时其中的字段要与前端名称相同,如 
await axiosInstance.post('/api/contracts/countersign', {
      code: selectedContract.value.code,
      cosigntime:getCurrentTime(),
      cosigncontent: opinion.value,
      status: '待定稿'
    })
后端数据名称也应为code，cosigntime等
3.记得将utils文件夹里的所有文件中的baseUrl改为自己的后端
4.还有的功能还未实现，不过按顺序大部分都能做完，有缺失的地方记得提醒我，我会及时改