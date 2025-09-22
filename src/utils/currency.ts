// import accounting from 'accounting';
// // import Currency from 'database/models/currency';

// export const formatCurrency = (price: number, target: Currency): string => {
//   // let rate = 1;
//   let symbol = '';
//   let position = 'right';
//   let decimal = 2;
//   let thousand_separator = ',';
//   let decimal_separator = '.';
//   if (target) {
//     symbol = target.symbol;
//     position = target.position;
//     decimal = target.currency_decimal;
//     thousand_separator = target.thousand_separator;
//     decimal_separator = target.decimal_separator;
//   }

//   let formatPrice = accounting.formatMoney(price, {
//     symbol: '',
//     precision: decimal,
//     thousand: thousand_separator,
//     decimal: decimal_separator,
//   });

//   if (position == 'right') {
//     formatPrice = `${formatPrice}${symbol}`;
//   } else if (position == 'right_space') {
//     formatPrice = `${formatPrice} ${symbol}`;
//   } else if (position == 'left_space') {
//     formatPrice = `${symbol} ${formatPrice}`;
//   } else {
//     formatPrice = `${symbol} ${formatPrice}`;
//   }

//   return formatPrice;
// };
