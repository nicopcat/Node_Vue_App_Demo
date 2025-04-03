// 成功响应
const success = (data = null, msg = '操作成功') => {
  return {
    code: 200,
    data,
    msg
  };
};

// 错误响应
const error = (msg = '操作失败', code = 500) => {
  return {
    code,
    data: null,
    msg
  };
};

module.exports = {
  success,
  error
}; 