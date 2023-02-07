import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdventureMap from "./AdventureMap";
import SelectedCheckPoint from "./SelectedCheckPoint";
import SelectPostModal from "./SelectPostModal";

import styles from "./Step1CheckPoint.module.css";
import styles2 from "../../pages/ArticleCreatePage.module.css";
import { MdAddLocationAlt } from "react-icons/md";

const Step1CheckPoint = ({
  myPosts,
  setMyPosts,
  checkpoints,
  setCheckpoints,
  adventure,
  setAdventure,
}) => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const count = useMemo(() => {
    return myPosts && myPosts.length;
  }, [myPosts]);

  const openModal = () => {
    if (myPosts.length === 5) {
      alert("체크포인트는 최대 5개까지 선택할 수 있습니다.");
    } else {
      setShowModal(true);
      document.body.style.overflow = "hidden";
    }
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "unset";
  };

  const selectPost = (post) => {
    const isDuplicated = !checkpoints.every((point) => {
      return point.postId !== post.postId;
    });
    if (!isDuplicated) {
      const newCheckpoint = {
        adventurePlaceTitle: "",
        adventurePlaceContent: "",
        coordinate: {
          lat: post.lat,
          lng: post.lng,
        },
        postId: post.postId,
      };
      setCheckpoints((checkpoints) => [...checkpoints, newCheckpoint]);
      closeModal();
    } else {
      alert("이미 선택한 게시글입니다. 다른 게시글을 선택해주세요.");
    }
  };

  const deselectPost = (post) => {
    setCheckpoints((checkpoints) =>
      checkpoints.filter((point) => {
        return point.postId !== post.postId;
      })
    );
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 === lat2 && lon1 === lon2) return 0;

    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radTheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) dist = 1;

    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
  };

  const exp = useMemo(() => {
    const cp = checkpoints;
    let dist = 0;
    for (let i = 0; i < cp.length; i++) {
      for (let j = 0; j < cp.length; j++) {
        dist += getDistance(cp[i].lat, cp[i].lng, cp[j].lat, cp[j].lng);
      }
    }
    dist /= cp.length * 2;
    return dist / 50;
  }, [checkpoints]);

  const difficulty = useMemo(() => {
    if (exp < 100) {
      return 1;
    } else if (exp < 500) {
      return 2;
    } else if (exp < 1500) {
      return 3;
    } else if (exp < 5000) {
      return 4;
    } else {
      return 5;
    }
  }, [exp]);

  return (
    <>
      <h1 className={styles2.header}>탐험 생성</h1>
      <div className={styles.detail}>
        탐험으로 만들 내 글을 선택하세요!
        <br />
        게시글은 <b>최대 5개</b>까지 선택할 수 있습니다.
      </div>

      <div className={styles.status}>현재 체크포인트 개수 {count}/5</div>

      {checkpoints.map((point) => (
        <SelectedCheckPoint
          key={point.postId}
          point={point}
          deselectPost={deselectPost}
          checkpoints={checkpoints}
          setCheckpoints={setCheckpoints}
          isRep={adventure.RepresentativePostId === point.postId}
          setAdventure={setAdventure}
        />
      ))}

      <div className={styles.addBox} onClick={openModal}>
        <div>
          <MdAddLocationAlt size={40} />
          <div>체크포인트 추가</div>
        </div>
      </div>

      <h3 className={styles.subHeader}>탐험 지도 미리보기</h3>
      <AdventureMap checkpoints={checkpoints} />

      {checkpoints.length > 1 && <div>이 탐험의 난이도 {difficulty}</div>}

      <button onClick={() => navigate(-1)}>취소</button>
      <button
        onClick={() => {
          if (checkpoints.length < 2) {
            alert("체크포인트를 2개 이상 선택해주세요.");
          } else if (!adventure.photo) {
            alert("대표 이미지를 선택해 주세요.");
          } else {
            setAdventure((adv) => ({ ...adv, difficulty: difficulty }));
            navigate("/adventure/create/2");
          }
        }}
      >
        다음
      </button>

      {showModal && (
        <SelectPostModal
          myPosts={myPosts}
          setMyPosts={setMyPosts}
          closeModal={closeModal}
          selectPost={selectPost}
        />
      )}
    </>
  );
};

export default Step1CheckPoint;
