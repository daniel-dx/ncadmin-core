// 通过配置中的method配置项，判断数据是放入params中还是data中。
// 供axios使用
export function axiosOptions(method, data){
    const options = {
        method: method || 'get',
    };
    options[options.method === 'get' ? 'params' : 'data'] = data;
    
    return options;
}

export default {
    axiosOptions
}