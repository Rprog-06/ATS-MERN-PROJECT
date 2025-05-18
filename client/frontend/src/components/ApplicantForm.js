const token = localStorage.getItem("token");

const formData = new FormData();
formData.append("name", name);
formData.append("email", email);
formData.append("phone", phone);
formData.append("marks", marks);
formData.append("resume", resume); // make sure resume is a file

await API.post(`/applications/${jobId}`, formData, {
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${token}`,
  },
});
