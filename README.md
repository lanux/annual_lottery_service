#年会抽奖刮刮乐 服务端

## About

* desc      : cmmmon nodejs service
* copyright : created and amended by jie.zou, 2014-04-19 0954
*             updated by jie.zou, 2016-01-09 1006, amended framework as a simple copyright for canudilo.com

## Descrition 

  it's just a backend nodejs service, store any struct data into files, and can be invoke by public interface

## Progress 

1. startup node worker.js as follow:
    > node worker.js             // run
    > nohup node worker.js &     // backgroup run

2. modify the config
    > vi conf/config.json        // programe set (like nodejs server port, store file address)
    > vi conf/filter.js          // request filter set
    > vi common/constants.js     // common constants

3. invoke url
    http://localhost:3000/bamboo/promotion.bo?type=list                            //query all data from the file
    http://localhost:3000/bamboo/promotion.bo?type=add&data={"id":1,"name":"test"} //add data into the file (any type data，but can be useful by json format data )

4. develop or modify module code
    can be refresh promotion code by module controller file ( /routes/service/promotion.js )

