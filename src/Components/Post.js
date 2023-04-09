import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment/moment";
import axios from "axios";

//images
import PostCover from "../assets/post-cover.jpg";
import ProfilePic from "../assets/profile-pic.jpg";
import Comment from "../assets/comment.png";
import Close from "../assets/close.png";
import Edit from "../assets/edit.png";
import Delete from "../assets/delete.png";

function Post() {
  const [allComments, setAllComments] = useState([]);
  const [addComment, setAddComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [updateComment, setUpdateComment] = useState(false);
  const [updateCommentVal, setUpdateCommentVal] = useState("");
  const [updatedComment, setUpdatedComment] = useState("");
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const onPostClick = () => {
    const data = {
      name: "userName",
      comment: newComment,
      time: Date.now(),
      commentId: Date.now(),
    };

    if (newComment) {
      setAddComment(false);

      axios
        .post("http://localhost:8080/postComments", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const onClearClick = () => {
    document.getElementById("comment").value = "";
    setNewComment("");
  };

  const onDeleteClick = (time) => {
    axios
      .delete("http://localhost:8080/deleteComment", {
        headers: {
          commentId: deleteId,
        },
      })
      .then((res) => {
        setAllComments([]);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onUpdateClick = () => {
    axios
      .put("http://localhost:8080/updateComment", {
        newComment: updatedComment,
        time: Date.now(),
        commentId: updateId,
      })
      .then((res) => {
        setUpdateComment(false);
        setAllComments([]);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    // localStorage.setItem("comments", JSON.stringify(allComments));
    axios
      .get("http://localhost:8080/getComments")
      .then((res) => {
        setAllComments([...res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [allComments]);

  return (
    <Container>
      <div className="container">
        <div className="profile-container">
          <div className="name-container">
            <div className="profile-image"></div>
            <div className="profile-name">
              <div className="name">Venura Warnasooriya</div>
              <div className="time">12 min ago</div>
            </div>
          </div>
          <div className="more-options">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
        <PostContainer></PostContainer>
        <CommentSection className={allComments.length === 0 ? "active" : ""}>
          <div className="count">
            <img src={Comment} alt="comment-count" />
            {allComments.length}
          </div>
          <div className="btn-container" onClick={() => setAddComment(true)}>
            Add Comment
          </div>
        </CommentSection>
        {!addComment && !updateComment ? (
          <>
            {allComments.length !== 0 ? (
              <ShowComments>
                {allComments.map((comment, index) => (
                  <div className="profile" key={index}>
                    <div className="name-container">
                      <div className="profile-image"></div>
                      <div className="profile-name">
                        <div className="name">{comment.name}</div>
                        <div className="time">{moment(comment.time).fromNow()}</div>
                      </div>
                    </div>
                    <div className="comment">{comment.comment}</div>
                    <div className="popup-update">
                      <div
                        className="edit"
                        onClick={() => {
                          setUpdateComment(true);
                          setUpdateCommentVal(comment.comment);
                          setUpdateId(comment.commentId);
                        }}
                      >
                        <img src={Edit} alt="edit-btn" />
                        Edit
                      </div>
                      <div
                        className="delete"
                        onClick={() => {
                          onDeleteClick(comment.time);
                          setDeleteId(comment.commentId);
                        }}
                      >
                        <img src={Delete} alt="delete-btn" />
                        Delete
                      </div>
                    </div>
                  </div>
                ))}
              </ShowComments>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {!updateComment ? (
              <AddComment>
                <div className="close-btn">
                  <img src={Close} alt="close-btn" onClick={() => setAddComment(false)} />
                </div>
                <div className="textarea-container">
                  <textarea name="comment" id="comment" onChange={(e) => setNewComment(e.target.value)} placeholder="Enter Your Comment"></textarea>
                </div>
                <div className="btn-container">
                  <div className="submit btn" onClick={() => onPostClick()}>
                    Post The Comment
                  </div>
                  <div className="clear btn" onClick={() => onClearClick()}>
                    Clear
                  </div>
                </div>
              </AddComment>
            ) : (
              <UpdateComment>
                <div className="close-btn">
                  <img src={Close} alt="close-btn" onClick={() => setUpdateComment(false)} />
                </div>
                <div className="textarea-container">
                  <textarea name="update-comment" id="update-comment" onChange={(e) => setUpdatedComment(e.target.value)} placeholder="Update Your Comment">
                    {updateCommentVal}
                  </textarea>
                </div>
                <div className="btn-container">
                  <div className="submit btn" onClick={() => onUpdateClick()}>
                    Update Comment
                  </div>
                  <div className="clear btn" onClick={() => onClearClick()}>
                    Clear
                  </div>
                </div>
              </UpdateComment>
            )}
          </>
        )}
      </div>
    </Container>
  );
}

export default Post;

const Container = styled.div`
  position: relative;

  .container {
    width: 650px;
    height: max-content;
    min-height: 200px;
    background-color: var(--post-background);
    border-radius: 12px;
    box-shadow: 0 0 5px 0px black;
    z-index: 10;
    overflow: hidden;

    .profile-container {
      padding-inline: 20px;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 0;

      .name-container {
        display: flex;
        align-items: center;
        column-gap: 10px;

        .profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          background-image: url(${ProfilePic});
          background-position: top;
          background-size: cover;
        }

        .profile-name {
          .name {
            font-size: 0.9rem;
            font-weight: 600;
            color: var(--text-heading-color);
          }

          .time {
            font-size: 0.5rem;
            font-weight: 600;
            color: var(--text-sub-color);
          }
        }
      }

      .more-options {
        z-index: 10;
        display: flex;
        row-gap: 2px;
        flex-direction: column;
        cursor: pointer;

        div {
          width: 5px;
          height: 5px;
          background-color: var(--text-heading-color);
          border-radius: 50%;
        }
      }
    }
  }
`;

const PostContainer = styled.div`
  width: 100%;
  height: 300px;
  background-image: url(${PostCover});
  background-size: cover;
  background-position: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CommentSection = styled.div`
  height: max-content;
  margin-inline: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: -10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--text-heading-color);

  &.active {
    border-bottom: none;
  }

  .count {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-heading-color);
    column-gap: 5px;

    img {
      width: 20px;
    }
  }

  .btn-container {
    background-color: var(--btn-color);
    padding: 10px 20px;
    font-size: 0.8rem;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: var(--btn-color-alt);
    }
  }
`;

const ShowComments = styled.div`
  width: 100%;
  height: 200px;
  overflow: auto;
  overflow: overlay;
  margin-top: 10px;
  margin-bottom: 20px;
  padding-inline: 20px;
  transition: all 0.3s ease;

  &:hover {
    &::-webkit-scrollbar-thumb {
      border-radius: 12px;
      background-color: var(--text-heading-color);
    }
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background-color: transparent;
  }

  .profile {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #cbdad5;
    position: relative;
    overflow: hidden;

    .name-container {
      display: flex;
      column-gap: 10px;
      .profile-image {
        width: 30px;
        height: 30px;
        background-image: url(${ProfilePic});
        background-size: cover;
        background-position: center;
        border-radius: 50%;
      }

      .profile-name {
        display: flex;
        column-gap: 20px;

        .name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-heading-color);
        }

        .time {
          font-size: 0.5rem;
        }
      }
    }

    .comment {
      font-size: 0.8rem;
      padding-left: 40px;
      margin-top: -10px;
      opacity: 0.7;
    }

    .popup-update {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      background-color: var(--post-background);
      height: 100%;
      top: 0;
      right: 0;
      cursor: pointer;
      transform: translateX(200px);
      transition: all 0.3s ease;

      .delete,
      .edit {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100px;
        height: 100%;
        column-gap: 10px;
        transition: all 0.3s ease;

        img {
          width: 20px;
        }

        &:hover {
          background-color: lightgray;
        }
      }

      .edit {
        border-right: 1px solid black;
      }
    }

    &:hover {
      .popup-update {
        transform: translateX(0px);
      }
    }
  }
`;

const AddComment = styled.div`
  width: 100%;
  padding-inline: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
  height: 200px;

  .close-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    cursor: pointer;

    img {
      width: 20px;
    }
  }

  .textarea-container {
    width: 100%;
    height: 110px;

    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: 1px solid var(--text-heading-color);
      background-color: var(--post-background);
      border-radius: 12px;
      outline: none;
      padding: 20px;
      font-size: 1rem;
      font-family: sans-serif;

      &:focus {
        border: 2px solid var(--text-heading-color);
      }
    }
  }

  .btn-container {
    display: flex;
    column-gap: 20px;
    margin-top: 10px;

    .btn {
      flex: 1;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .submit {
      background-color: var(--btn-color);

      &:hover {
        background-color: var(--btn-color-alt);
      }
    }

    .clear {
      background-color: var(--btn-danger);

      &:hover {
        background-color: var(--btn-danger-alt);
      }
    }
  }
`;

const UpdateComment = styled.div`
  width: 100%;
  padding-inline: 20px;
  margin-bottom: 20px;
  margin-top: 10px;
  height: 200px;

  .close-btn {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
    cursor: pointer;

    img {
      width: 20px;
    }
  }

  .textarea-container {
    width: 100%;
    height: 110px;

    textarea {
      width: 100%;
      height: 100%;
      resize: none;
      border: 1px solid var(--text-heading-color);
      background-color: var(--post-background);
      border-radius: 12px;
      outline: none;
      padding: 20px;
      font-size: 1rem;
      font-family: sans-serif;

      &:focus {
        border: 2px solid var(--text-heading-color);
      }
    }
  }

  .btn-container {
    display: flex;
    column-gap: 20px;
    margin-top: 10px;

    .btn {
      flex: 1;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      transition: all 0.3s ease;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .submit {
      background-color: var(--btn-color);

      &:hover {
        background-color: var(--btn-color-alt);
      }
    }

    .clear {
      background-color: var(--btn-danger);

      &:hover {
        background-color: var(--btn-danger-alt);
      }
    }
  }
`;
