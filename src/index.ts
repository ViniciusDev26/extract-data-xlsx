import xlsx from 'node-xlsx';
import { resolve } from "path"

function groupBy(key: string, array: any[]) {
  let result: any[] = [];
  for (let i in array) {
    let added = false;
    for (let j in result) {
      if (result[j][key] == array[i][key]) {
        result[j].items.push(array[i]);
        added = true;
        break;
      }
    }
    if (!added) {
      let entry: {items: any[]} = {items: []};
      entry[key] = array[i][key];
      entry.items.push(array[i]);
      result.push(entry);
    }
  }
  return result;
}

function main() {
  const csvPath = resolve("assets", "alunos.xlsx")
  const result = xlsx.parse(csvPath)[0].data;

  //* 1 = cityName
  //* 2 = foreignSchoolId
  //* 3 = schoolName
  //* 4 = grade
  //* 5 = className
  //* !7 = foreignCityId
  //* !7 = foreignClassId
  //* !9 = foreignStudentId
  //* !10 = name

  let classes = groupBy('7', result)
  classes.map(({items: classObj}) => {
    return {
      className: classObj[0][8],
      schoolName: classObj[0][3],
      cityName: classObj[0][1],
      grade: classObj[0][4],
      foreignClassId: classObj[0][7],
      foreignSchoolId: classObj[0][2],
      students: classObj.map(student => ({
        foreignId: student[9],
        name: student[10],
      })),
    }
  })
  .forEach(console.dir)
}

main();