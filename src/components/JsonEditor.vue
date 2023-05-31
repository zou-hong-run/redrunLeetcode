<script setup>
import { onMounted, ref, watch } from 'vue';
const editorRef = ref();
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';

const editor = monaco.editor;
let resultEditor = null
const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);
watch(()=>props.modelValue,(newVal,oldVal)=>{
  // 防止改变编辑器内容时光标重定向
  if(newVal!==resultEditor?.getValue()){
    resultEditor.setValue(newVal)
  }
})
onMounted(() => {
  // console.log(editorRef.value);
  /**
   * 第一个参数：容器 必填
   * 第二个参数：create配置选项 可选
   * 第三个参数：复写的方法 可选
   */
  // 在指定的dom节点内创建并渲染编辑器，指定的dom节点应当是一个空元素，也就是说里面不包含其他dom节点
  resultEditor = editor.create(
    editorRef.value,
    {
      value: props.modelValue,// 编辑器的初始值
      theme: "vs-dark",// 样式主题 'vs' (default), 'vs-dark', 'hc-black', 'hc-light'
      language: "javascript",// 编辑器的初始语言,例如可以设置为javascript, json等
      // model:null,//和编辑器关联的初始模型
      lineNumbers: "on",// 页面是否显示行号 off on relative interval
      readOnly: false,// 是否只读
      autoClosingBrackets: 'always',// 自动闭合括号
      autoClosingOvertype: "always",// 自动闭合括号或引号
      autoClosingQuotes: "always",//自动闭合引号
      autoIndent: "advanced",// 自动缩进
      automaticLayout:true,
      // comments:"",// 是否启用注释功能，如果启用该功能，将允许添加注释，
      contextmenu: true,// 是否不禁止鼠标右击
      // contextmenuItems: [
      //   { label: 'xx', id: 'cut', },
      //   { label: 'ww', id: 'copy', },
      //   { label: 'waa', id: 'paste', },
      //   { label: 'aaaaa All', id: 'selectAll', },
      //   { label: '--aa--', id: 'separator', },
      //   { label: 'Custom Action', id: 'customAction', },
      // ],
      // copyWithSyntaxHighlighting:"blink",//将编辑器中的文本复制到剪切板，并保留高亮语法
      dragAndDrop: true,//支持拖放文件和文本
      fontSize: null,// 控制字体大小
      // fontWeight:"bold",// 字体加粗
      mouseStyle: "default",// 定义鼠标的样式 text default copy
      showDeprecated: true,// 显示已经废弃的代码
      // showFoldingControls:'always',控制折叠控件的显示方式
    },
  );
  //   实例   事件

  // 用户右键点击编辑器触发，通过这个事件来自定义右键菜单
  resultEditor.onContextMenu(e => {
    console.log(e.event.posx);
    e.event.preventDefault();//阻止默认事件
  })
  resultEditor.onDidChangeModel(e=>{
    console.log("文章发送变化");
  })
  // monacoEditor.onDidChangeModelContent(() => {
  //       const currenValue = monacoEditor?.getValue();
  //       emit('update:value', currenValue);
  //   });
  // 监听键盘变化
  resultEditor.onDidChangeModelContent(()=>{
    const currenValue = resultEditor?.getValue();
    emit("update:modelValue",currenValue)
  })
  // resultEditor.onDidAttemptReadOnlyEdit() 用户尝试编辑只读文本时候触发的函数
  // resultEditor.onDidBlurEditorText() 编辑器失去焦点的时候触发
  // ...onDidChangeConfiguration 编辑器配置发生变化的时候触发
  // onDidPast()编辑器粘贴文本时候触发
  // onKeyDown 编辑器按下按钮触发

  //    方法
  // 向编辑器中添加自定义行为
  resultEditor.addAction({
    // 唯一id
    id: 'my-custom-action',
    // 操作的名称
    label: '我自定义的行为',
    // 操作的快捷键
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
    ],
    // 操作在右键菜单中的分组ID，必须是字符串
    contextMenuGroupId: 'navigation',
    // 在右键菜单中的排序位置
    contextMenuOrder: 1.5,
    // 操作执行的函数
    run: function (ed) {

      console.log('My custom action executed');
    }
  });
  // 向编辑器中添加自定义的操作
  resultEditor.addCommand(
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
    function (ed) {
      console.log('Custom command executed');
    },
    'editor'
  );// 最后一个参数用于指定命令的上下文，editor/textarea/global

  // 向编辑器中添加自定义内容小部件 添加水印
  // const widget = {
  //   getId: function () {
  //     return 'my-content-widget';
  //   },
  //   getDomNode: function () {
  //     const node = document.createElement('div');
  //     node.innerHTML = 'My content widget';
  //     return node;
  //   },
  //   getPosition: function () {
  //     return {
  //       position: {
  //         lineNumber: 1,
  //         column: 1
  //       },
  //       preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE, monaco.editor.ContentWidgetPositionPreference.BELOW]
  //     };
  //   }
  // };
  // resultEditor.addContentWidget(widget);

  // 重叠 添加水印
  // const widget = {
  //   getId: function () {
  //     return 'my-overlay-widget';
  //   },
  //   getDomNode: function () {
  //     const node = document.createElement('div');
  //     node.innerHTML = 'My overlay widget';
  //     return node;
  //   },
  //   getPosition: function () {
  //     return {
  // 水印位置
  //       preference: [monaco.editor.OverlayWidgetPositionPreference.TOP_RIGHT_CORNER]
  //     };
  //   }
  // };
  // resultEditor.addOverlayWidget(widget);

  // 改变编辑器的视图区域
  // resultEditor.changeViewZones(function (changeAccessor) {
  //   const domNode = document.createElement('div');
  //   domNode.innerHTML = 'My view zone';
  //   const afterLineNumber = 3;
  //   const heightInLines = 2;
  //   changeAccessor.addZone({
  //     afterLineNumber: afterLineNumber,
  //     heightInLines: heightInLines,
  //     domNode: domNode
  //   });
  // });

  // 获取编辑器里面的内容 ==========
  // const value = resultEditor.getValue();

  // 重新布局编辑器
  // resultEditor.layout()

  // 重新渲染编辑器
  // resultEditor.render();




  // 修改主题
  // editor.defineTheme(themeName: string, themeData: monaco.editor.IStandaloneThemeData)自定义主题
  editor.defineTheme('demo-custom', {
    base: "hc-black",
    inherit: true,
    rules: [{ background: '#cccccc' }],
    colors: {
      'editor.background': '#cccccc',     //背景色
    }
  });
  // 设置主题
  // editor.setTheme("demo-custom");

  // 注册一门新语言
  // monaco.languages.register({ id: "mySpecialLanguage" })

  // 设置编辑器的文本模型 读文件
  // const model = monaco.editor.createModel('Hello, world!', 'plaintext');
  // resultEditor.setModel(model);


  // diff比较代码修改情况
  // var originalModel = monaco.editor.createModel("heLLo world!", "text/plain");
  // var modifiedModel = monaco.editor.createModel("hello orlando!", "text/plain");

  // var diffEditor = monaco.editor.createDiffEditor(editorRef.value)
  // diffEditor.setModel({
  //   original: originalModel,
  //   modified: modifiedModel
  // });

  // 提供diff导航
  // The diff editor offers a navigator to jump between changes. Once the diff is computed the <em>next()</em> and <em>previous()</em> method allow navigation. By default setting the selection in the editor manually resets the navigation state.
  // var originalModel = monaco.editor.createModel("just some text\n\nHello World\n\nSome more text", "text/plain");
  // var modifiedModel = monaco.editor.createModel("just some Text\n\nHello World\n\nSome more changes", "text/plain");


  // var diffEditor = monaco.editor.createDiffEditor(editorRef.value);
  // diffEditor.setModel({
  //   original: originalModel,
  //   modified: modifiedModel
  // });

  // var navi = monaco.editor.createDiffNavigator(diffEditor, {
  //   followsCaret: true, // resets the navigator state when the user selects something in the editor
  //   ignoreCharChanges: true // jump from line to line
  // });

  // window.setInterval(function () {
  //   navi.next();
  // }, 2000);

  //    编辑器相关

  // const action = {
  //   id: 'my_eeeeee',
  //   label: 'eeeeee',
  //   run: () => {
  //     console.log('My Action triggered');
  //   }
  // };

  // const disposable = monaco.editor.addEditorAction(action);// 返回一个用来取消动作的对象

  // 定义一个新的主题
  // monaco.editor.defineTheme('my-theme', {
  //   base: 'vs-dark',
  //   inherit: true,
  //   rules: [
  //     { token: 'comment', foreground: 'ffa500', fontStyle: 'italic' },
  //     { token: 'keyword', foreground: '00ff00' },
  //     { token: 'string', foreground: 'ff0000' }
  //   ],
  //   colors: {
  //     'editor.background': '#1e1e1e',
  //     'editor.foreground': '#d4d4d4',
  //     'editorCursor.foreground': '#d4d4d4',
  //     'editor.lineHighlightBackground': '#3c3c3c',
  //     'editorLineNumber.foreground': '#d4d4d4',
  //     'editor.selectionBackground': '#3c3c3c'
  //   }
  // });

  // monaco.editor.setTheme('my-theme');
  // 获取model文件
  // const uri = monaco.Uri.parse('file:///../test.txt');
  // const model = monaco.editor.getModel(uri);
  // console.log(uri);
  // if (model) {
  //   console.log(model.getValue());
  // } else {
  //   console.log('Model not found');
  // }

  // 设置编辑器布局
  


})

</script>

<template>
  <div ref="editorRef" id="container"></div>
</template>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
