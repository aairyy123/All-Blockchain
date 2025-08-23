
export const uploadToIPFS = async ({ title, content }) => {
  const blob = new Blob([JSON.stringify({ title, content })], { type: "application/json" });
  const file = new File([blob], "blog.json");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);

  const response = await fetch("http://localhost:5000/api/blogs/upload", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data.cid;
};
