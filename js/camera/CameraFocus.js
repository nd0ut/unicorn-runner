import { CameraExt } from "./CameraExt";
import { lerp, Vec2 } from "../math";

export class CameraFocus extends CameraExt {  
    constructor(controller) {
        super('focus', controller);

        this.followEntity = undefined;
        this.noticeEntity = undefined;

        this.noticeTime = undefined;
        this.noticeStarted = false;
        this.noticeReached = false;
        this.followRestored = false;
        this.noticeResolver = undefined;

        this.damping = this.defaultDamping
        this.camOffset = this.defaultCamOffset
        this.reachDistance = 500;
    }

    get defaultDamping() {
        return 0.4;
    }

    get defaultCamOffset() {
        return new Vec2(0, 0);
    }

    update(deltaTime, time) {
        this.checkNotice(deltaTime, time);
        this.following(deltaTime, time);
    }

    follow(entity) {
        this.followEntity = entity;
        this.entity = entity;
    }

    following(deltaTime, time) {
        if (!this.entity) {
            return;
        }

        let entityX = this.entity.pos.x - this.camOffset.x;

        if (Math.abs(this.cam.pos.x - entityX) > 0.1) {
            entityX = lerp(
                this.cam.pos.x,
                entityX,
                1 / this.damping * deltaTime
            );
        }

        this.cam.pos.x = entityX;
    }

    notice(noticeEntity, time) {
        this.noticeStarted = true;
        this.noticeEntity = noticeEntity
        this.noticeTime = time;
        this.entity = noticeEntity;
        this.followEntity.run.stop();
        this.camOffset.x = this.cam.size.x / 3;

        return new Promise((res) => {
            this.noticeResolver = res;
        })
    }

    onNoticeReach() {
        this.noticeReached = true;

        setTimeout(() => {
            this.entity = this.followEntity;
        }, this.noticeTime);
    }

    onFollowReach(time) {
        this.followRestored = true;
    }

    checkNotice(deltaTime, time) {
        if(this.noticeStarted && this.noticeReached && this.followRestored) {
            this.stopNotice();
            return;
        }

        if(this.noticeStarted && !this.noticeReached) {
            const distToNotice = Math.abs(this.entity.pos.x - this.cam.pos.x);
            if(distToNotice < this.reachDistance) {
                this.onNoticeReach();
            }

        }

        if(this.noticeStarted && this.noticeReached && !this.followRestored) {
            const distToFollow = Math.abs(this.followEntity.pos.x - this.cam.pos.x);
            if(distToFollow < this.reachDistance) {
                this.onFollowReach(time);
            }
        }
    }

    stopNotice() {
        this.noticeResolver();

        this.noticeTime = undefined;
        this.noticeStarted = false;
        this.noticeReached = false;
        this.followRestored = false;
        this.noticeResolver = undefined;

        this.followEntity.run.resume();
        this.camOffset = this.defaultCamOffset;
    }
}
