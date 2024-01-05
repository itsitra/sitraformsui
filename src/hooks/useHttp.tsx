import axios, { Axios, AxiosResponse } from "axios";
let urlorigin = ''
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
     urlorigin = 'http://192.168.1.19/sitraformsbackend/index.php/api'
} else {
     urlorigin = 'http://sitraonline.org.in/sitraformsbackend/index.php/api'
}

type resType = {
     data: any,
     error: string | boolean | null,
     loading: boolean,
}

type postResType = {
     data: any,
     error: string | boolean | null,
     loading: boolean,
     message: string
}

async function Get(url: string, signal: AbortSignal): Promise<resType> {
     let data = null;
     let error = null;
     let loading = false;
     await axios
          .get(urlorigin + url, { signal: signal })
          .then((res: any) => {
               loading = true;
               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (res.data.data === undefined || res.data.data === false) {
                    loading = false;

                    throw new Error(
                         "Error in processing data, Enter Correct User Credientials"
                    );
               }
               if (Array.isArray(res.data.data)) {
                    let d: any = [];
                    res.data.data.forEach((e: any) => {
                         d.push(e);
                    });
                    data = d;

                    loading = false;
               } else {
                    data = res.data.data;
                    loading = false;
               }
          })
          .catch((err: any) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });
     return { data, error, loading };
};

async function Post(url: string, jdata: object | object[] | string): Promise<postResType> {
     let data = null;
     let error: boolean | string | null = null;
     let loading: boolean = false;
     let message: string = ""

     await axios
          .post(urlorigin + url, jdata)
          .then((res: AxiosResponse) => {
               loading = true;


               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (res.data.data === undefined || res.data.data === false) {
                    loading = false;
                    message = res.data.message;
                    throw new Error(
                         "Error in processing data, Enter Correct User Credientials"
                    );
               }
               if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                    // console.log(res.data.data[0], "1");
                    data = [];
                    res.data.data.forEach((element: any) => {
                         data.push(element);
                    });
                    loading = false;
                    message = res.data.message;

               } else {
                    data = res.data.data;
                    message = res.data.message;
                    loading = false;
               }

          })
          .catch((err) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });

     return { data, error, loading, message };
};

const Put = async (url: string, jdata: object | object[]) => {
     let data = null;
     let error = null;
     let loading = false;
     await axios
          .put(url, jdata)
          .then((res) => {
               loading = true;

               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (res.data.data === undefined || res.data.data === false) {
                    loading = false;

                    throw new Error(
                         "Error in processing data, Enter Correct User Credientials"
                    );
               }
               if (Array.isArray(res.data.data)) {
                    data = [];
                    res.data.data.foreach((d: any) => {
                         data.push(d);
                    });
                    loading = false;
               } else {
                    data = res.data.data;
                    loading = false;
               }
          })
          .catch((err) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });

     return { data, error, loading };
};

async function OtherPost(url: string, jdata: object | object[] | string): Promise<postResType> {
     let data = null;
     let error: boolean | string | null = null;
     let loading: boolean = false;
     let message: string = ""

     await axios
          .post(url, jdata)
          .then((res: AxiosResponse) => {
               loading = true;


               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (!res.data.hasOwnProperty('payload')) {
                    loading = false;
                    message = res.data.message;
                    data = res.data.data
                    // throw new Error(
                    //      "Error in processing data, Enter Correct User Credientials"
                    // );
               }
               if (res.data.hasOwnProperty('payload')) {

                    data = res.data.payload;
                    message = res.data.message;
                    loading = false;
               }

          })
          .catch((err) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });

     return { data, error, loading, message };
};

async function OtherGet(url: string): Promise<postResType> {
     let data = null;
     let error: boolean | string | null = null;
     let loading: boolean = false;
     let message: string = ""

     await axios
          .get(url)
          .then((res: AxiosResponse) => {
               loading = true;


               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (!res.data.hasOwnProperty('payload')) {
                    loading = false;
                    message = res.data.message;
                    data = res.data.data
                    // throw new Error(
                    //      "Error in processing data, Enter Correct User Credientials"
                    // );
               }
               if (res.data.hasOwnProperty('payload')) {

                    data = res.data.payload;
                    message = res.data.message;
                    loading = false;
               }

          })
          .catch((err) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });

     return { data, error, loading, message };
};


const Delete = async (url: string) => {
     let data = null;
     let error = null;
     let loading = false;
     await axios
          .delete(url)
          .then((res) => {
               console.log(res.data);
               loading = true;

               data = null;
               if (res.status !== 200) {
                    loading = false;

                    throw new Error("Error in api or connection");
               } else if (res.data.data === undefined || res.data.data === false) {
                    loading = false;

                    throw new Error(
                         "Error in processing data, Enter Correct User Credientials"
                    );
               }
               if (Array.isArray(res.data.data)) {
                    data = [];
                    res.data.data.foreach((d: any) => {
                         data.push(d);
                    });
                    loading = false;
               } else {
                    data = res.data.data;
                    loading = false;
               }
          })
          .catch((err) => {
               if (err) {
                    error = err;
                    loading = false;
               }
          });

     return { data, error, loading };
};

const useHttp = () => {
     return {
          Get,
          Post,
          Put,
          Delete, OtherPost, OtherGet
     };
};

export default useHttp;