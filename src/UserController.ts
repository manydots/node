import {JsonController,QueryParam, ForbiddenError,Param, Body, Get, Post, Put, Delete} from "routing-controllers";

export interface BlogFilter {
    keyword: string;
    limit: number;
    offset: number;
}


@JsonController()
export class UserController {

    @Get("/blogs")
    getAll(@QueryParam("filter", { required: true, parse: true }) filter: BlogFilter) {
        return [
            { id: 1, name: "Blog " + filter.keyword },
            { id: 2, name: "Blog " + filter.keyword }
        ];
    }

    @Get("/blogs/:id")
    getOne(@Param("id") ids: number, @QueryParam("name",{required: true}) names: string) {

        try{
          if (!names) {
            throw new ForbiddenError("参数异常");
            return {
              code: 401,
              message: '缺少name参数',
            }
          }
        }catch(e){
            console.log(e)
        }
        return { id: ids, name: names };
    }

}