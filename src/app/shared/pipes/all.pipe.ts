import { Pipe, PipeTransform } from '@angular/core';
//gonna use this for sorting later cuz now its just date sort that doesnt hold its value after refreshing 
// @Pipe({
//   name: 'sportType',
//   standalone: true,
// })
// export class sportType implements PipeTransform {
//   transform<T>(array: T[], property: keyof T, direction?: Type): T[] {
//     return array.sort((a, b) => {
//       if (a[property] < b[property]) {
//         return direction === 'asc' ? -1 : 1;
//       } else if (a[property] > b[property]) {
//         return direction === 'asc' ? 1 : -1;
//       } else {
//         return 0;
//       }
//     });
//   }
// }
