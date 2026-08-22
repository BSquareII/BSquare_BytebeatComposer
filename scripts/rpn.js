//from https://zopium.neocities.org/bytebeat

export class ws {
  constructor(stackSize=256) {
    this.stackSize = stackSize;
    this.sp = 0;
    this.stack = Array(stackSize).fill(0);
  }

  push(v) {
    this.stack[this.sp++] = v;
    this.sp = this.sp % this.stackSize;
  }
  
  clear() {
    this.stack = Array(stackSize).fill(0);
    this.sp = 0;
  }

  pop() {
    this.sp = (this.sp === 0) ? (this.stackSize - 1) : (this.sp - 1);
    return this.stack[this.sp];
  }

  pick(index) {
    let i = this.sp - Math.floor(index) - 1;
    while (i < 0) i += this.stackSize;
    return this.stack[i % this.stackSize];
  }

  put(index, value) {
    let i = this.sp - Math.floor(index);
    while (i < 0) i += this.stackSize;
    this.stack[i % this.stackSize] = value;
  }

  gsp() {
    return this.sp;
  }
}
export function RPN(c) {
  c = String(c).toLowerCase();
  const ts = c.split(/\s+/).filter(Boolean);
  let steps=[];
  
  steps.push("let v1,v2;");
  for (const token of ts){
    switch (token) {
      case ">":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push("stack.push(v1>v2?0xFFFFFFFF:0);");
        break;
      case "<":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push("stack.push(v1<v2?0xFFFFFFFF:0);");
        break;
      case "=":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push("stack.push(v1==v2?0xFFFFFFFF:0);");
        break;
      case "drop":
        steps.push("stack.pop();");
        break;
      case "dup":
        steps.push("stack.push(stack.pick(0));");
        break;
      case "swap":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push("stack.push(v2);");
        steps.push("stack.push(v1);");
        break;
      case "pick":
        steps.push("v1=stack.pop();");
        steps.push("stack.push(stack.pick(v1));");
        break;
      case "put":
        steps.push("v1=stack.pop();");
        steps.push("v2=stack.pick(0);");
        steps.push("stack.put(v1,v2);");
        break;
      case "abs":
      case "sqrt":
      case "round":
      case "tan":
      case "log":
      case "exp":
      case "sin":
      case "cos":
      case "floor":
      case "ceil":
      case "int":
        steps.push("v1=stack.pop();");
        steps.push(`stack.push(${token}(v1));`);
        break;
      case "max":
      case "min":
      case "pow":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push(`stack.push(${token}(v1,v2));`);
        break;
      case "random":
        steps.push("stack.push(random());");
        break;
      case "/":
      case "+":
      case "-":
      case "*":
      case "%":
      case ">>":
      case "<<":
      case "|":
      case "&":
      case "^":
      case "&&":
      case "||":
        steps.push("v2=stack.pop();");
        steps.push("v1=stack.pop();");
        steps.push(`stack.push((v1${token}v2)|0);`);
        break;
      case "~":
        steps.push('stack.push(~stack.pop());');
        break;
      default:
        steps.push(`stack.push(${token});`);
    }
  }
  steps.push("return stack.pop();");

  const full = steps.join("\n");
  return full;
}