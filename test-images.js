// 测试图片预览功能
// 在浏览器控制台中运行以下代码来添加测试图片

// 创建一个简单的测试图片（Canvas生成）
function createTestImage(text, color = '#6366f1') {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // 绘制背景
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 200);
    
    // 绘制文字
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 150, 100);
    
    return canvas.toDataURL();
}

// 添加测试图片的函数
function addTestImages() {
    const testImages = [
        {
            name: '测试图片1.png',
            dataUrl: createTestImage('图片 1', '#6366f1'),
            size: 15000,
            type: 'image/png'
        },
        {
            name: '测试图片2.png', 
            dataUrl: createTestImage('图片 2', '#10b981'),
            size: 18000,
            type: 'image/png'
        },
        {
            name: '测试图片3.png',
            dataUrl: createTestImage('图片 3', '#f59e0b'),
            size: 20000,
            type: 'image/png'
        }
    ];
    
    testImages.forEach(imageData => {
        const item = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            name: imageData.name,
            dataUrl: imageData.dataUrl,
            size: imageData.size,
            type: imageData.type,
            uploadDate: new Date().toISOString(),
            category: 'images',
            tags: ['测试', '示例']
        };
        
        window.knowledgeBase.data.images.push(item);
    });
    
    window.knowledgeBase.saveData();
    window.knowledgeBase.updateStats();
    window.knowledgeBase.refreshCurrentSection();
    window.knowledgeBase.showRecentItems();
    
    console.log('测试图片已添加！');
}

// 使用说明：
// 1. 打开浏览器开发者工具
// 2. 在控制台中运行：addTestImages()
// 3. 然后点击图片收藏查看效果
// 4. 点击任意图片测试预览功能