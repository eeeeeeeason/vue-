 - template如何转为带有标签及属性的对象，
    - 答：AST抽象语法树
- 全流程，模板为<div id="abc"><p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>
    - 全文主要以parse执行parseHTML,parse传入两个参数，template模板，options(start:判断起始标签，将得到的elemnt格式化为标准模式，end：判断结束标签，将父级向上一层滚动，chars将{{}}内容截取)
    - <div id="jump">起始标签的匹配细节</div><div id="abc">
        - 1.判断是否以<为开始，第一个标签必然是，那么进入parseStartTag处理起始标签内容，startTagOpen正则进行匹配得到标签名<div或div,记录此标签的起始位置0，tagName为匹配得到的[1]div
        - advance将index向前推进<div个数目并且删除模板的<div以进行下一步正则匹配
        - 若此时匹配不到起始标签的闭合符号“>”，且能够匹配到属性如id=“abc”，那么将index继续向前推id=“abc”的长度，删除模板中id属性，循环操作直到匹配得到起始标签的闭合符号，index再推进>符号的长度，模板删除>后，记录此时为起始标签的结束位置
        - 此时我们匹配得到的元素还不够规范，长这样⏬,需要进行修改
        ```
            {tagName: "div", attrs: 0: [" id="abc"", "id", "=", "abc", undefined, undefined, index: 0, input: " id="abc"><p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>", groups: undefined], start: 0, end: 14}
        ```
        - handleStartTag方法判断是否为单标签，若不是即将格式化后的对象塞入数组stack中这里面没有start,end.只有{id:"abc"}和标签名，将lastTag设置为当前格式化完毕的标签
        - 最后进行parse的options.start处理，将第一个标签设置为CurrentParent,同时设为根元素,这样第一个标签<div id="abc">就处理完毕
    - 子元素标签的匹配
        - 由于模板还没遍历完毕，继续执行parseHTML，此时模板html = "<p class="www">{{msg}}</p><p class="hhh"><span>{{msg1}}</span></p></div>"
        - 匹配到p的起始标签继续执行<a href="#jump">起始标签的匹配</a>