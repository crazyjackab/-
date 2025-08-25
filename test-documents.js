// 测试文档功能
// 在浏览器控制台中运行以下代码来添加测试文档

// 创建示例文档数据
function addTestDocuments() {
    const testDocuments = [
        {
            name: '项目计划书.pdf',
            type: 'application/pdf',
            size: 2048000,
            description: '详细的项目开发计划和时间安排',
            content: null, // PDF文件无法直接预览
            dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVGl0bGUgKP7/AHUAcwBlAHIAcwAgAG0AYQB1AG4AYQB1AGwpCi9Qcm9kdWNlciAo/v8ARABvAG0AUABEAEYADC5vcmcpCi9DcmVhdG9yICj+/wBXAHIAaQB0AGUAcgApCi9DcmVhdGlvbkRhdGUgKEQ6MjAwNjA5MjgxNjU0MzUrMDInMDAnKQo+PgplbmRvYmoKCjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0K...' // 简化的base64
        },
        {
            name: '技术文档.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 856000,
            description: 'API接口技术说明文档',
            content: null,
            dataUrl: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,UEsDBBQABgAIAAAAIQDd...'
        },
        {
            name: '数据分析.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 456000,
            description: '用户行为数据分析报表',
            content: null,
            dataUrl: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQABgAIAAAAIQDd...'
        },
        {
            name: '产品介绍.pptx',
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            size: 3200000,
            description: '产品功能介绍演示文稿',
            content: null,
            dataUrl: 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,UEsDBBQABgAIAAAAIQDd...'
        },
        {
            name: '学习笔记.txt',
            type: 'text/plain',
            size: 5120,
            description: 'JavaScript学习要点记录',
            content: `JavaScript 学习笔记

1. 变量声明
   - let: 块级作用域
   - const: 常量声明
   - var: 函数作用域（不推荐使用）

2. 数据类型
   - 基本类型: string, number, boolean, null, undefined, symbol, bigint
   - 引用类型: object, array, function

3. 函数
   - 函数声明: function foo() {}
   - 函数表达式: const foo = function() {}
   - 箭头函数: const foo = () => {}

4. Promise 和 async/await
   - Promise 解决回调地狱问题
   - async/await 让异步代码看起来像同步代码

5. ES6+ 新特性
   - 解构赋值
   - 模板字符串
   - 扩展运算符
   - 模块化 import/export

6. DOM 操作
   - querySelector/querySelectorAll
   - addEventListener
   - createElement/appendChild

持续学习，不断进步！`,
            dataUrl: null
        }
    ];
    
    testDocuments.forEach(docData => {
        const item = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: docData.name,
            type: docData.type,
            size: docData.size,
            description: docData.description,
            content: docData.content,
            dataUrl: docData.dataUrl,
            uploadDate: new Date().toISOString(),
            category: 'documents',
            tags: window.knowledgeBase.autoGenerateTags({
                name: docData.name,
                type: docData.type
            })
        };
        
        window.knowledgeBase.data.documents.push(item);
    });
    
    window.knowledgeBase.saveData();
    window.knowledgeBase.updateStats();
    window.knowledgeBase.refreshCurrentSection();
    window.knowledgeBase.showRecentItems();
    
    console.log('测试文档已添加！');
    console.log('各种文档类型包括：PDF、Word、Excel、PowerPoint、文本文件');
    console.log('点击文档卡片查看不同样式，点击预览按钮测试预览功能');
}

// 调试预览功能
function debugPreview() {
    console.log('检查文档预览模态框:');
    const modal = document.getElementById('documentPreviewModal');
    console.log('模态框元素:', modal);
    
    const closeBtn = document.getElementById('closeDocumentPreview');
    console.log('关闭按钮:', closeBtn);
    
    const downloadBtn = document.getElementById('downloadDocument');
    console.log('下载按钮:', downloadBtn);
    
    const container = document.getElementById('documentContent');
    console.log('内容容器:', container);
    
    console.log('知识库实例:', window.knowledgeBase);
    console.log('文档预览模态框实例:', window.knowledgeBase?.documentPreviewModal);
}

// 手动测试预览功能
function testPreview() {
    if (window.knowledgeBase && window.knowledgeBase.data.documents.length > 0) {
        const firstDoc = window.knowledgeBase.data.documents[0];
        console.log('测试预览第一个文档:', firstDoc);
        window.knowledgeBase.openDocumentPreview(firstDoc);
    } else {
        console.log('没有找到文档，请先运行 addTestDocuments()');
    }
}

// 使用说明：
// 1. 打开浏览器开发者工具
// 2. 在控制台中运行：addTestDocuments() - 添加测试文档
// 3. 运行 debugPreview() - 检查预览功能初始化状态
// 4. 运行 testPreview() - 手动测试预览功能
// 5. 然后点击文档资料查看效果
// 6. 注意观察不同文档类型的颜色和图标
// 7. 点击预览按钮测试文档预览功能