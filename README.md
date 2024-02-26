#### install
`yarn | npm i`

#### dev
`yarn dev | npm vite dev`

#### 配置
修改 src/config.ts 下的配置
 - fetchUrl：后端api地址，留空使用本地promise
 - debounceDelay：防抖间隔

#### 附录
smartCompose为高阶组件，可以接受启用了contentEditable属性的React组件

组件需要实现onChange和onKeydown,详见interface ToSmartComposeProps

onChange的第二个参数是光标位置，用于处理用户输入和组件逻辑导致的光标问题，可以参考App.tsx中的示例组件

由于周末有事外出，功能开发不完全，计划中基于多div的多行编辑器组件时间不足没有实现

理论上添加活动行判定，跟踪显示提示，完善光标逻辑可以完成

单元测试由于光标操作无法在虚拟dom中运行，只编写了代码没有测试