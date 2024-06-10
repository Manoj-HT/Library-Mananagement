const fs = require("fs");

class DataStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.file = fs.readFileSync(filePath, "utf-8");
    this.array = [...JSON.parse(this.file)];
    this.map = new Map(this.array);
  }

  save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.array));
  }

  create(key, value) {
    if (this.map.has(key)) {
      throw new Error("Key Exists");
    }
    this.map.set(key, value);
    this.array.push(value);
  }

  getSize() {
    return this.array.length;
  }

  getAllInArray() {
    return this.array;
  }

  getInMap() {
    return this.map;
  }

  getById(key) {
    if (this.map.has(key)) {
      throw new Error("Item doesn't exist");
    }
    return this.map.get(key);
  }

  getByIdList(...keys){
    let list = []
    for(let key of keys){
      let item = this.getById(key)
      list.push(item)
    }
    return list
  }

  update(key, value) {
    if (this.map.has(key)) {
      throw new Error("Item doesn't exist");
    }
    this.map.set(key, value);
    let index = this.array.findIndex((item) => item.id === key);
    this.array[index] = value;
  }

  delete(key) {
    if (this.map.has(key)) {
      throw new Error("Item doesn't exist");
    }
    this.map.delete(key);
    let index = this.array.findIndex((item) => item.id === key);
    this.array.splice(index, 1);
  }
}

module.exports = { DataStore };
