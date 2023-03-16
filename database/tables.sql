create table
    category (
        id VARCHAR(40) not null,
        name VARCHAR(255) not null,
        PRIMARY KEY (id)
    );

create table
    article (
        id VARCHAR(40) not NULL,
        title VARCHAR(200) NOT NULL,
        content text,
        category_id VARCHAR(40),
        PRIMARY KEY (id),
        FOREIGN KEY (category_id) REFERENCES category(id)
    );

select *
from article
    left join category on article.category_id = category.id;

select
    article.id,
    article.title,
    article.content,
    article.category_id,
    category.name as category_name
from article
    left join category on article.category_id = category.id;

select * from employees where employeeNumber = ( select salesRepemployeeNumber from customers where customerNumber = (select customerNumber from orders where orderDate between '2003-05-06' and '2003-12-31'));
select  * from employees 
where employeeNumber = (select distinct salesRepEmployeeNumber from customers where customerNumber = (select customerNumber from orders where status not in ('shipped'))); 

select distinct salesRepEmployeeNumber from customers
left join orders on customers.customerNumber = orders.customerNumber where orders.status not in ('shipped');
select distinct employeeNumber,lastName , firstName ,extension ,email ,officeCode  , reportsTo  , jobTitle from employees 
left join customers on employees.employeeNumber = customers.salesRepEmployeeNumber
left join orders on customers.customerNumber = orders.customerNumber where orders.status not in ('shipped');

select distinct employeeNumber,lastName , firstName ,extension ,email ,officeCode  , reportsTo  , jobTitle from employees 
left join customers on employees.employeeNumber = customers.salesRepEmployeeNumber 
left join payments on customers.customerNumber = payments.customerNumber where payments.paymentDate between '2003-05-06' and '2003-12-31'


select distinct  orderdetails.orderNumber , productCode , quantityOrdered , priceEach , orderLineNumber from orderdetails 
left join orders on orderdetails.orderNumber = orders.orderNumber where orders.status = 'in process';

SELECT productCode, COUNT(productCode) 
FROM orderdetails  GROUP BY productCode 
HAVING COUNT (productCode)=( 
SELECT MAX(mycount) 
FROM ( 
SELECT productCode, COUNT(productCode) mycount 
FROM orderdetails 
GROUP BY productCode));
 
 S18_1662    | Planes           |
| S18_2581    | Planes           |
| S24_1785    | Planes           |
| S24_2841    | Planes           |
| S24_3949    | Planes           |
| S24_4278    | Planes           |
| S700_1691   | Planes           |
| S700_2466   | Planes           |
| S700_2834   | Planes           |
| S700_3167   | Planes           |
| S700_4002   | Planes           |
| S72_1253    | Planes     


select sum(quantityordered*priceEach) from orderdetails
left join products on orderdetails.productCode = products.productCode where productLine = 'Classic Cars';
select productLine ,sum(quantityOrdered ) from products 
left join orderDetails on products.productCode = orderDetails.productCode 
left join orders on orderDetails.orderNumber = orders.orderNumber where orderDate between '2003-01-01' and '2003-12-31' group by productLine;
 


select count(*) from orderdetails 
left join products on orderDetails.productCode = products.productCode where quantityInStock < 100 ; 
select productCode , productName ,productLine , productScale , productVendor  ,productDescription from products
left join orderDetails on products.productCode = orderDetails.productCode 
where orderDetails.priceEach < products.buyPrice;
select sum(buyprice)/count(productcode) from products;
select * from products where buyPrice > (select sum(buyprice)/count(productcode) from products);

select * from products where quantityInStock = (select MAX(quantityInStock) from products);
select * from employees 
left join customers on employees.employeeNumber = customers.salesRepEmployeeNumber 
select * from employees credit limit 1;
select * from customers where salesRepEmployeeNumber = 1611;
333
select * from payments 
left join orders on payments.customerNumber = orders.customerNumber where orders.customerNumber = 333 limit 1;

select sum(creditLimit) from customers
