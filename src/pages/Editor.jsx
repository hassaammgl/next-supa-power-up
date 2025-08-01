// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import RichTextEditor from "@/components/shared/RichTextEditor";
// import CategoryTagSelector from "@/components/shared/CategoryTagSelector";
// import ImageUpload from "@/components/shared/ImageUpload";
// import { ArrowLeft, Save, Send, Loader2 } from "lucide-react";
// import { NavLink } from "react-router";
// import { useAuth } from "@/store/auth";
// import { supabase } from "@/supabase/supabase";
// import slugify from "slugify";
// import { useParams, useNavigate } from "react-router";
// import { useToast } from "@/hooks/useToast";
// import { linkPostTags } from "@/utils";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const Editor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { error: err, success } = useToast();

//   useEffect(() => {
//     if (!user) {
//       navigate("/auth");
//     }
//   }, [user, navigate]);

//   useEffect(() => {
//     if (id && user) {
//       loadPost();
//     }
//   }, [id, user]);

//   const [postData, setPostData] = useState({
//     title: "",
//     content: "",
//     cover_image_url: "",
//     author_id: user?.id,
//     slug: "",
//     published: false,
//     category_id: "",
//     tags: [],
//     visibility: "public",
//   });

//   const [isLoadingDraft, setIsLoadingDraft] = useState(false);
//   const [isLoadingPublish, setIsLoadingPublish] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const generateSlug = (title) => {
//     return slugify(title, {
//       lower: true,
//       remove: /[*+~.()'"!:@]/g,
//     });
//   };

// const loadPost = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("posts")
//       .select("*")
//       .eq("id", id)
//       .eq("author_id", user?.id)
//       .single();

//     if (error) throw error;

//     setPostData({
//       title: data.title,
//       content: data.content,
//       cover_image_url: data.cover_image_url,
//       author_id: data.author_id,
//       slug: data.slug,
//       published: data.published,
//       category_id: data.category_id,
//       tags: [], // consider loading tags if needed
//       visibility: data.visibility || "public",
//     });

//     setIsEditing(true);
//   } catch (error) {
//     console.error("Error loading post:", error);
//     err("Failed to load post.");
//     navigate("/");
//   }
// };

//   const handleDraft = async (e) => {
//     e.preventDefault();
//     setIsLoadingDraft(true);

//     const slug = generateSlug(postData.title);
//     try {
//       // 1. insert post
//       const { data: post, error: postError } = await supabase
//         .from("posts")
//         .insert([
//           {
//             title: postData.title,
//             content: postData.content,
//             cover_image_url: postData.cover_image_url,
//             author_id: user?.id,
//             slug,
//             published: false,
//             category_id: postData.category_id,
//           },
//         ])
//         .select()
//         .single();

//       if (postError) throw postError;

//       // 2. link tags
//       await linkPostTags(post.id, postData.tags);

//       success("✅ Post published!");
//       navigate("/");
//     } catch (error) {
//       console.error("❌ Upload failed:", error);
//       err("Something went wrong while publishing.");
//     } finally {
//       setIsLoadingDraft(false);
//     }
//   };
//   const handlePublish = async (e) => {
//     e.preventDefault();
//     setIsLoadingPublish(true);

//     const slug = generateSlug(postData.title);
//     try {
//       // 1. insert post
//       const { data: post, error: postError } = await supabase
//         .from("posts")
//         .insert([
//           {
//             title: postData.title,
//             content: postData.content,
//             cover_image_url: postData.cover_image_url,
//             author_id: user?.id,
//             slug,
//             published: true,
//             category_id: postData.category_id,
//           },
//         ])
//         .select()
//         .single();

//       if (postError) throw postError;

//       // 2. link tags
//       await linkPostTags(post.id, postData.tags);

//       success("✅ Post published!");
//       navigate("/");
//     } catch (error) {
//       console.error("❌ Upload failed:", error);
//       err("Something went wrong while publishing.");
//     } finally {
//       setIsLoadingPublish(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <NavLink to={"/"}>
//                 <Button variant="ghost" size="sm">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>
//               </NavLink>
//               <h1 className="text-xl font-semibold">Hana Editor</h1>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button onClick={handleDraft} variant="outline">
//                 {isLoadingDraft ? (
//                   <Loader2 className="animate-spin" />
//                 ) : (
//                   <Save className="w-4 h-4 mr-2" />
//                 )}
//                 Save Draft
//               </Button>
//               <Button onClick={handlePublish}>
//                 {isLoadingPublish ? (
//                   <Loader2 className="animate-spin" />
//                 ) : (
//                   <Send className="w-4 h-4 mr-2" />
//                 )}
//                 Publish
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             <div className="lg:col-span-2 space-y-6">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Post Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div>
//                     <Label htmlFor="title">Title *</Label>
//                     <Input
//                       id="title"
//                       name="title"
//                       value={postData.title}
//                       onChange={(e) => {
//                         const title = e.target.value;
//                         setPostData((prev) => ({
//                           ...prev,
//                           title,
//                           slug: title
//                             .toLowerCase()
//                             .replace(/[^a-z0-9]+/g, "-")
//                             .replace(/(^-|-$)/g, ""),
//                         }));
//                       }}
//                       placeholder="Enter your post title..."
//                       className="text-lg"
//                     />
//                   </div>
//                   <CategoryTagSelector
//                     selectedCategory={postData.category_id}
//                     selectedTags={postData.tags || []}
//                     onCategoryChange={(value) =>
//                       setPostData((prev) => ({ ...prev, category_id: value }))
//                     }
//                     onTagsChange={(updatedTags) =>
//                       setPostData((prev) => ({ ...prev, tags: updatedTags }))
//                     }
//                   />
//                 </CardContent>
//               </Card>
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Visibility</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Label htmlFor="visibility">Post Visibility</Label>
//                     <Select
//                       value={postData.visibility}
//                       onValueChange={(value) =>
//                         setPostData((prev) => ({
//                           ...prev,
//                           visibility: value,
//                         }))
//                       }
//                     >
//                       <SelectTrigger className="w-full" id="visibility">
//                         <SelectValue placeholder="Select visibility" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="public">Public</SelectItem>
//                         <SelectItem value="private">Private</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Cover Image</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <ImageUpload
//                     onImageUploaded={(url) =>
//                       setPostData((prev) => ({ ...prev, cover_image_url: url }))
//                     }
//                     currentImage={postData.cover_image_url}
//                     bucket="blog-images"
//                   />
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardHeader>
//                   <CardTitle>Content *</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <RichTextEditor
//                     content={postData.content}
//                     onChange={(e) =>
//                       setPostData((prev) => ({ ...prev, content: e }))
//                     }
//                     placeholder="Start writing your post..."
//                   />
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Editor;

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/shared/RichTextEditor";
import CategoryTagSelector from "@/components/shared/CategoryTagSelector";
import ImageUpload from "@/components/shared/ImageUpload";
import { ArrowLeft, Save, Send, Loader2 } from "lucide-react";
import { NavLink, useParams, useNavigate } from "react-router";
import { useAuth } from "@/store/auth";
import { supabase } from "@/supabase/supabase";
import slugify from "slugify";
import { useToast } from "@/hooks/useToast";
import { linkPostTags } from "@/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getTags } from "@/utils";

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { error: err, success } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const [isLoadingPublish, setIsLoadingPublish] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    cover_image_url: "",
    author_id: user?.id,
    slug: "",
    published: false,
    category_id: "",
    tags: [],
    visibility: "public",
  });

  useEffect(() => {
    if (!user) navigate("/auth");
  }, [user, navigate]);

  useEffect(() => {
    if (id && user) loadPost();
  }, [id, user]);

  const generateSlug = (title) =>
    slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

  const loadPost = async () => {
    try {
      const { data: post, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .eq("author_id", user?.id)
        .single();

      if (error || !post) throw error;

      // load post_tags
      const { data: tagLinks } = await supabase
        .from("post_tags")
        .select("tag_id")
        .eq("post_id", id);

      const tagsData = await getTags(tagLinks?.map((t) => t.tag_id))

      setPostData({
        title: post.title,
        content: post.content,
        cover_image_url: post.cover_image_url,
        author_id: post.author_id,
        slug: post.slug,
        published: post.published,
        category_id: post.category_id,
        tags: tagsData,
        visibility: post.visibility || "public",
      });

      setIsEditing(true);
    } catch (error) {
      console.error("Error loading post:", error);
      err("Failed to load post.");
      navigate("/");
    }
  };

  const savePost = async (published) => {
    const slug = generateSlug(postData.title);

    const newPost = {
      title: postData.title,
      content: postData.content,
      cover_image_url: postData.cover_image_url,
      author_id: user?.id,
      slug,
      published,
      category_id: postData.category_id,
      visibility: postData.visibility,
    };

    let postId;

    if (isEditing) {
      const { data, error } = await supabase
        .from("posts")
        .update(newPost)
        .eq("id", id)
        .eq("author_id", user?.id)
        .select()
        .single();

      if (error) throw error;
      postId = data.id;
    } else {
      const { data, error } = await supabase
        .from("posts")
        .insert([newPost])
        .select()
        .single();

      if (error) throw error;
      postId = data.id;
    }

    // Link tags
    await linkPostTags(postId, postData.tags);
  };

  const handleDraft = async (e) => {
    e.preventDefault();
    setIsLoadingDraft(true);
    try {
      await savePost(false);
      success("✅ Draft saved!");
      navigate("/");
    } catch (error) {
      console.error("❌ Save draft failed:", error);
      err("Something went wrong while saving.");
    } finally {
      setIsLoadingDraft(false);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsLoadingPublish(true);
    try {
      await savePost(true);
      success("✅ Post published!");
      navigate("/");
    } catch (error) {
      console.error("❌ Publish failed:", error);
      err("Something went wrong while publishing.");
    } finally {
      setIsLoadingPublish(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <NavLink to={"/"}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </NavLink>
              <h1 className="text-xl font-semibold">Hana Editor</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleDraft} variant="outline">
                {isLoadingDraft ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </>
                )}
              </Button>
              <Button onClick={handlePublish}>
                {isLoadingPublish ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Post Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Post Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={postData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setPostData((prev) => ({
                          ...prev,
                          title,
                          slug: slugify(title, { lower: true }),
                        }));
                      }}
                      placeholder="Enter your post title..."
                      className="text-lg"
                    />
                  </div>

                  <CategoryTagSelector
                    selectedCategory={postData.category_id}
                    selectedTags={postData.tags}
                    onCategoryChange={(value) =>
                      setPostData((prev) => ({ ...prev, category_id: value }))
                    }
                    onTagsChange={(tags) =>
                      setPostData((prev) => ({ ...prev, tags }))
                    }
                  />
                </CardContent>
              </Card>

              {/* Visibility */}
              <Card>
                <CardHeader>
                  <CardTitle>Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="visibility">Post Visibility</Label>
                  <Select
                    value={postData.visibility}
                    onValueChange={(value) =>
                      setPostData((prev) => ({
                        ...prev,
                        visibility: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full" id="visibility">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Cover Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Cover Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    currentImage={postData.cover_image_url}
                    onImageUploaded={(url) =>
                      setPostData((prev) => ({
                        ...prev,
                        cover_image_url: url,
                      }))
                    }
                    bucket="blog-images"
                  />
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Content *</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextEditor
                    content={postData.content}
                    onChange={(html) =>
                      setPostData((prev) => ({ ...prev, content: html }))
                    }
                    placeholder="Start writing your post..."
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
