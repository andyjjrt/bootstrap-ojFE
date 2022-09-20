import Vue from "vue";

function downloadFile(url) {
  return new Promise((resolve, reject) => {
    Vue.$http
      .get(url, { responseType: "blob" })
      .then((resp) => {
        let headers = resp.headers;
        if (headers["content-type"].indexOf("json") !== -1) {
          let fr = new window.FileReader();
          if (resp.data.error) {
            this.$message.error({
              message: resp.data.error,
              duration: 1500,
              zIndex: 1000000,
            });
          } else {
            this.$message.error({
              message: "Invalid file format",
              duration: 1500,
              zIndex: 1000000,
            });
          }
          fr.onload = (event) => {
            let data = JSON.parse(event.target.result);
            if (data.error) {
              this.$message.error({
                message: data.data,
                duration: 1500,
                zIndex: 1000000,
              });
            } else {
              this.$message.error({
                message: "Invalid file format",
                duration: 1500,
                zIndex: 1000000,
              });
            }
          };
          let b = new window.Blob([resp.data], { type: "application/json" });
          fr.readAsText(b);
          return;
        }
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(
          new window.Blob([resp.data], { type: headers["content-type"] })
        );
        link.download = (headers["content-disposition"] || "").split(
          "filename="
        )[1];
        document.body.appendChild(link);
        link.click();
        link.remove();
        resolve();
      })
      .catch(() => {});
  });
}

export default {
  downloadFile: downloadFile,
};
