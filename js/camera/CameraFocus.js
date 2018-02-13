import { CameraExt } from './CameraExt';
import { lerp, Vec2 } from '../math';

const NoticeState = {
    IDLE: Symbol('IDLE'),
    STARTED: Symbol('STARTED'),
    REACHED: Symbol('REACHED'),
    RESTORED: Symbol('RESTORED')
}

export class CameraFocus extends CameraExt {
    constructor(controller) {
        super('focus', controller);

        this.followEntity = undefined;
        this.noticeEntity = undefined;

        this.noticeState = NoticeState.IDLE;

        this.noticeTime = undefined;
        this.noticeResolver = undefined;

        this.damping = this.defaultDamping;
        this.camOffset = this.defaultCamOffset;
        this.reachDistance = 500;
    }

    get defaultDamping() {
        return 0.3;
    }

    get defaultCamOffset() {
        return new Vec2(0, 100);
    }

    update(deltaTime, time, level) {
        if(level.frozen) {
            return;
        }

        this.checkNotice(deltaTime, time);
        this.following(deltaTime, time);
    }

    follow(entity) {
        if (this.noticeState !== NoticeState.IDLE) {
            this.stopNotice();
        }

        this.followEntity = entity;
        this.entity = entity;

        this.cam.pos.x = entity.pos.x;
        this.cam.pos.y = 0
    }

    following(deltaTime, time) {
        if (!this.entity) {
            return;
        }

        let entityX = this.entity.pos.x - this.camOffset.x;
        let entityY = this.entity.pos.y;

        if (Math.abs(this.cam.pos.x - entityX) > 0.1) {
            entityX = lerp(this.cam.pos.x, entityX, 1 / this.damping * deltaTime);
        }

        if (Math.abs(this.cam.pos.y - entityY) > 0.1) {
            entityY = lerp(this.cam.pos.y, entityY, 1 / this.damping * deltaTime);
        }

        this.cam.pos.x = entityX;
        this.cam.pos.y = Math.min(entityY, 0);
    }

    notice(noticeEntity, time, xOffset) {
        this.noticeState = NoticeState.NOTICE_STARTED;

        this.noticeEntity = noticeEntity;
        this.noticeTime = time;
        this.entity = noticeEntity;
        this.followEntity.run.stop();

        if(xOffset) {
            this.camOffset.x = xOffset;
        }

        return new Promise(res => {
            this.noticeResolver = res;
        });
    }

    onNoticeReach() {
        this.noticeState = NoticeState.REACHED;

        setTimeout(() => {
            this.entity = this.followEntity;
        }, this.noticeTime);
    }

    onNoticeRestore(time) {
        this.stopNotice();        
    }

    checkNotice(deltaTime, time) {
        if (this.noticeState === NoticeState.STARTED) {
            const distToNotice = Math.abs(this.entity.pos.x - this.cam.pos.x);
            if (distToNotice < this.reachDistance) {
                this.onNoticeReach();
            }
        }

        if (this.noticeState === NoticeState.REACHED) {
            const distToFollow = Math.abs(this.followEntity.pos.x - this.cam.pos.x);
            if (distToFollow < this.reachDistance) {
                this.onNoticeRestore(time);
            }
        }
    }

    stopNotice() {
        this.noticeState = NoticeState.IDLE;
        this.followEntity.run.resume();
        this.camOffset = this.defaultCamOffset;
        
        this.noticeResolver();

        this.noticeTime = undefined;
        this.noticeResolver = undefined;
    }
}
